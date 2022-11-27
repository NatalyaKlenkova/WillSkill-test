const body = document.body;
const html = document.documentElement;

// Отключение / включение скролла на странице
const bodyScrollControls = {
    scrollBarWidth: window.innerWidth - body.clientWidth,
  
    disable() {
      body.style.marginRight = `${this.scrollBarWidth}px`;
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        body.style.marginRight = null;
      }
      html.classList.add('stop-scroll');
    },
  
    enable() {
      body.style.marginRight = null;
      html.classList.remove('stop-scroll');
    }
  }

// Burger
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");
const menuCloseBtn = document.querySelector('.menu__close-btn');
const menuLinks = document.querySelectorAll('.nav__link');

burger.addEventListener('click', function () {
    menu.classList.add('menu--active');

    bodyScrollControls.disable();
})

menuCloseBtn.addEventListener('click', function () {
    menu.classList.remove('menu--active');

    bodyScrollControls.enable();
})

menuLinks.forEach(function(menuLink) {
    menuLink.addEventListener('click', function () {
        menu.classList.remove('menu--active');

        bodyScrollControls.enable();
    })
})

document.addEventListener('click', (e) => {
    const withinBoundaries0 = e.composedPath().includes(burger);
	const withinBoundaries1 = e.composedPath().includes(menuCloseBtn);
    const withinBoundaries2 = e.composedPath().includes(menuLinks);
 
	if ( ! withinBoundaries0 && ! withinBoundaries1 && ! withinBoundaries2 ) {
		menu.classList.remove('menu--active');

        bodyScrollControls.enable();
    }
})