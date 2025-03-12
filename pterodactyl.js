class Pterodactyl {
  constructor() {
    this.object = new THREE.Group();
    
    // Материал
    this.material = new THREE.MeshStandardMaterial({ 
      color: 0x8B7765,
      roughness: 0.7,
      metalness: 0.1
    });
    
    // Тело
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
    const body = new THREE.Mesh(bodyGeometry, this.material);
    body.rotation.z = Math.PI / 2;
    this.object.add(body);

    // Голова и другие части (без изменений)
    // ... (код из оригинального pterodactyl.js)

    // Физические параметры
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0.1;
    this.lift = 0.02;
    this.boundingRadius = 1.0;
  }

  animateWings(time) {
    // ... (код из оригинального pterodactyl.js)
  }

  update(controls, deltaTime) {
    // Вертикальное движение
    if (controls.up) {
      this.velocity.y += this.lift;
    } else {
      this.velocity.y *= 0.95;
    }

    // Горизонтальное движение
    if (controls.left) {
      this.velocity.x = -this.speed;
    } else if (controls.right) {
      this.velocity.x = this.speed;
    } else {
      this.velocity.x *= 0.95;
    }

    // Ограничиваем скорость
    this.velocity.y = Math.max(Math.min(this.velocity.y, 0.2), -0.2);
    
    // Обновляем позицию
    this.object.position.x += this.velocity.x;
    this.object.position.y += this.velocity.y;

    // Наклон
    this.object.rotation.z = -this.velocity.y * 2;
  }

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
