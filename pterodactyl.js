class Pterodactyl {
  constructor() {
    // Создаем группу для всех частей птеродактиля
    this.object = new THREE.Group();
    
    // Материал для птеродактиля (коричневато-серый цвет)
    this.material = new THREE.MeshStandardMaterial({ 
      color: 0x8B7765,
      roughness: 0.7,
      metalness: 0.1
    });
    
    // Создаем тело (вытянутый эллипсоид)
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
    const body = new THREE.Mesh(bodyGeometry, this.material);
    body.rotation.z = Math.PI / 2; // Поворачиваем тело горизонтально
    this.object.add(body);
    
    // Создаем голову (конус)
    const headGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
    const head = new THREE.Mesh(headGeometry, this.material);
    head.position.set(1.2, 0, 0); // Размещаем голову спереди тела
    head.rotation.z = -Math.PI / 2; // Поворачиваем голову
    this.object.add(head);
    
    // Создаем гребень на голове
    const crestGeometry = new THREE.ConeGeometry(0.1, 0.4, 4);
    const crest = new THREE.Mesh(crestGeometry, this.material);
    crest.position.set(1.2, 0.3, 0);
    crest.rotation.z = Math.PI;
    this.object.add(crest);
    
    // Создаем крылья (тонкие плоскости)
    const wingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B7765, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    
    // Левое крыло
    const leftWingGeometry = new THREE.PlaneGeometry(2, 0.8);
    const leftWing = new THREE.Mesh(leftWingGeometry, wingMaterial);
    leftWing.position.set(0, 0, -0.7);
    leftWing.rotation.y = Math.PI / 4;
    this.object.add(leftWing);
    
    // Правое крыло
    const rightWingGeometry = new THREE.PlaneGeometry(2, 0.8);
    const rightWing = new THREE.Mesh(rightWingGeometry, wingMaterial);
    rightWing.position.set(0, 0, 0.7);
    rightWing.rotation.y = -Math.PI / 4;
    this.object.add(rightWing);
    
    // Хвост
    const tailGeometry = new THREE.ConeGeometry(0.1, 0.8, 4);
    const tail = new THREE.Mesh(tailGeometry, this.material);
    tail.position.set(-1.2, 0, 0);
    tail.rotation.z = Math.PI / 2;
    this.object.add(tail);
    
    // Установим начальное положение и вращение
    this.object.position.set(0, 0, 0);
    this.object.rotation.y = Math.PI / 2; // Направить птеродактиля вперед
    
    // Физические свойства
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0.15;
    this.gravity = -0.005;
    this.lift = 0.015;
    
    // Создаем ограничивающую сферу для определения столкновений
    this.boundingRadius = 1.0;
  }
  
  // Метод для анимации взмахов крыльев
  animateWings(time) {
    const wings = this.object.children.filter(child => 
      child.geometry instanceof THREE.PlaneGeometry);
    
    if (wings.length === 2) {
      const leftWing = wings[0];
      const rightWing = wings[1];
      
      // Анимируем движение крыльев вверх и вниз
      leftWing.rotation.z = Math.sin(time * 5) * 0.2;
      rightWing.rotation.z = Math.sin(time * 5) * 0.2;
    }
  }
  
  // Метод для обновления положения птеродактиля
  update(controls, deltaTime) {
    // Применяем гравитацию
    this.velocity.y += this.gravity;
    
    // Обрабатываем управление
    if (controls.up) {
      this.velocity.y += this.lift;
    }
    
    if (controls.left) {
      this.velocity.x = -this.speed;
    } else if (controls.right) {
      this.velocity.x = this.speed;
    } else {
      this.velocity.x *= 0.95; // Замедление по горизонтали
    }
    
    // Ограничиваем скорость
    this.velocity.y = Math.max(Math.min(this.velocity.y, 0.2), -0.2);
    
    // Обновляем положение
    this.object.position.x += this.velocity.x;
    this.object.position.y += this.velocity.y;
    
    // Ограничиваем движение по y в пределах игрового поля
    if (this.object.position.y > 10) {
      this.object.position.y = 10;
      this.velocity.y = 0;
    }
    if (this.object.position.y < -10) {
      this.object.position.y = -10;
      this.velocity.y = 0;
    }
    
    // Наклоняем птеродактиля в направлении движения
    this.object.rotation.z = -this.velocity.y * 2;
  }
  
  // Метод для проверки столкновений со скалами
  checkCollision(rocks) {
    for (const rock of rocks) {
      const distance = this.object.position.distanceTo(rock.object.position);
      if (distance < this.boundingRadius + rock.boundingRadius) {
        return true; // Столкновение произошло
      }
    }
    return false; // Столкновений нет
  }
  
  // Метод для получения положения птеродактиля
  getPosition() {
    return this.object.position;
  }
  
  // Метод для сброса положения птеродактиля
  reset() {
    this.object.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
  }
}
