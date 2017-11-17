import './main.css';

function initializeGame() {
  const container = document.getElementById('app') as HTMLElement;
  const aspectRatio = 256 / 224;

  let width = container.clientWidth;
  let height = width / aspectRatio;

  if (height > container.clientHeight) {
    height = container.clientHeight;
    width = height * aspectRatio;
  }
}
