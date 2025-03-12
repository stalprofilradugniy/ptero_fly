class Game {
  constructor() {
    // Установка размеров игрового поля
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    // Создаем сцену
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Голубое небо
    
    // Создаем камеру
    this.camera = new THREE.PerspectiveCamera(
      75, this.width / this.height, 0.1, 1000
    );
    this.camera.position.z = 5;
    
    // Создаем рендерер
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('game-container').appendChild(this.renderer.domElement);
    
    // Добавляем свет
    this.addLights();
    
    // Создаем птеродактиля
    this.pterodactyl = new Pterodactyl();
    this.scene.add(this.pterodactyl.object);
    
    // Создаем генератор скал
    this.rockGenerator = new RockGenerator(this.scene);
    
    // Состояние игры
    this.isGameOver = false;
    this.score = 0;
    this.scoreElement = document.getElementById('score');
    this.gameOverElement = document.getElementById('game-over');
    
    // Управление
    this.controls = {
      up: false,
      left: false,
      right: false
    };
    
    // Время
    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    this.elapsedTime = 0;
    
    // Добавляем обработчики событий
    this.setupEventListeners();
    
    // Запускаем игровой цикл
    this.animate();
  }
  
  // Метод для добавления света на сцену
  addLights() {
    // Направленный свет (имитация солнца)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Амбиентный свет для общего освещения
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
  }
  
  // Метод для настройки обработчиков событий
  setupEventListeners() {
    // Обработчик нажатия клавиш
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.controls.up = true;
          break;
        case 'ArrowLeft':
          this.controls.left = true;
          break;
        case 'ArrowRight':
          this.controls.right = true;
          break;
        case ' ': // Пробел
          if (this.isGameOver) {
            this.restartGame();
          }
          break;
      }
    });
    
    // Обработчик отпускания клавиш
    window.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.controls.up = false;
          break;
        case 'ArrowLeft':
          this.controls.left = false;
          break;
        case 'ArrowRight':
          this.controls.right = false;
          break;
      }
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(this.width, this.height);
    });
  }
  
  // Метод для обновления счета
  updateScore() {
    this.score += 1;
    this.scoreElement.textContent = `Счет: ${this.score}`;
  }
  
  // Метод для завершения игры
  gameOver() {
    this.isGameOver = true;
    this.gameOverElement.classList.remove('hidden');
  }
  
  // Метод для перезапуска игры
  restartGame() {
    this.isGameOver = false;
    this.score = 0;
    this.scoreElement.textContent = `Счет: ${this.score}`;
    this.gameOverElement.classList.add('hidden');
    
    // Сбрасываем положение птеродактиля
    this.pterodactyl.reset();
    
    // Сбрасываем генератор скал
    this.rockGenerator.reset();
    
    // Сбрасываем время
    this.clock.start();
    this.elapsedTime = 0;
  }
  
  // Основной игровой цикл
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Если игра окончена, не обновляем состояние
    if (this.isGameOver) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    
    // Обновляем время
    this.deltaTime = this.clock.getDelta();
    this.elapsedTime += this.deltaTime;
    
    // Обновляем счет каждую секунду
    if (Math.floor(this.elapsedTime) > Math.floor(this.elapsedTime - this.deltaTime)) {
      this.updateScore();
    }
    
    // Обновляем птеродактиля
    this.pterodactyl.update(this.controls, this.deltaTime);
    this.pterodactyl.animateWings(this.elapsedTime);
    
    // Обновляем генератор скал
    this.rockGenerator.update(this.deltaTime, this.camera.position);
    
    // Проверяем столкновения
    if (this.pterodactyl.checkCollision(this.rockGenerator.getRocks())) {
      this.gameOver();
    }
    
    // Рендерим сцену
    this.renderer.render(this.scene, this.camera);
  }
}
