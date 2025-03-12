class Rock {
  constructor(position, size) {
    // Создаем геометрию скалы (используем икосаэдр для более "скалистого" вида)
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    
    // Создаем материал для скалы (серый цвет)
    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.9,
      metalness: 0.1
    });
    
    // Создаем меш скалы
    this.object = new THREE.Mesh(geometry, material);
    
    // Устанавливаем позицию
    this.object.position.copy(position);
    
    // Добавляем случайное вращение для разнообразия
    this.object.rotation.x = Math.random() * Math.PI;
    this.object.rotation.y = Math.random() * Math.PI;
    this.object.rotation.z = Math.random() * Math.PI;
    
    // Добавляем случайное искажение вершин для более естественного вида
    if (geometry.attributes.position) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.2 * size;
        positions[i + 1] += (Math.random() - 0.5) * 0.2 * size;
        positions[i + 2] += (Math.random() - 0.5) * 0.2 * size;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
    
    // Ограничивающий радиус для определения столкновений
    this.boundingRadius = size * 1.2; // Немного увеличиваем для надежности
  }
  
  // Метод для перемещения скалы (для движения скал к игроку)
  update(speed) {
    this.object.position.z += speed;
  }
  
  // Метод для проверки, находится ли скала позади камеры
  isOutOfBounds(cameraPosition) {
    return this.object.position.z > cameraPosition.z + 10;
  }
}

// Класс для управления генерацией скал
class RockGenerator {
  constructor(scene) {
    this.scene = scene;
    this.rocks = [];
    this.rockSpeed = 0.2;
    this.spawnDistance = -100; // Расстояние от камеры, на котором появляются скалы
    this.spawnInterval = 60; // Интервал между появлением новых скал
    this.spawnTimer = 0;
    this.difficulty = 1;
  }
  
  // Метод для создания новой скалы
  createRock() {
    // Случайное положение в пределах игрового поля
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 30, // x от -15 до 15
      (Math.random() - 0.5) * 20, // y от -10 до 10
      this.spawnDistance // z всегда впереди камеры
    );
    
    // Случайный размер скалы
    const size = 1 + Math.random() * 2 * this.difficulty;
    
    // Создаем новую скалу
    const rock = new Rock(position, size);
    
    // Добавляем скалу на сцену и в массив скал
    this.scene.add(rock.object);
    this.rocks.push(rock);
  }
  
  // Метод для обновления всех скал
  update(deltaTime, cameraPosition) {
    // Увеличиваем таймер
    this.spawnTimer += deltaTime;
    
    // Если таймер превышает интервал, создаем новую скалу
    if (this.spawnTimer > this.spawnInterval) {
      this.createRock();
      this.spawnTimer = 0;
      
      // Уменьшаем интервал и увеличиваем сложность со временем
      this.spawnInterval = Math.max(20, this.spawnInterval - 0.1);
      this.difficulty = Math.min(3, this.difficulty + 0.01);
    }
    
    // Обновляем все скалы и удаляем те, которые вышли за пределы
    for (let i = this.rocks.length - 1; i >= 0; i--) {
      const rock = this.rocks[i];
      rock.update(this.rockSpeed);
      
      // Если скала вышла за пределы, удаляем ее
      if (rock.isOutOfBounds(cameraPosition)) {
        this.scene.remove(rock.object);
        this.rocks.splice(i, 1);
      }
    }
  }
  
  // Метод для получения массива скал (для проверки столкновений)
  getRocks() {
    return this.rocks;
  }
  
  // Метод для сброса генератора скал
  reset() {
    // Удаляем все скалы со сцены
    for (const rock of this.rocks) {
      this.scene.remove(rock.object);
    }
    
    // Очищаем массив скал
    this.rocks = [];
    
    // Сбрасываем параметры
    this.spawnTimer = 0;
    this.spawnInterval = 60;
    this.difficulty = 1;
  }
}
