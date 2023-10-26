'use strict';

//  ************************************************//
// ***** MODAL *******
//************************************************

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//  ************************************************//
// ***** SCROLLING SMOOTH *******
//************************************************

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // Scrolling

  // left + window.pageXOffset -> we can set the position based on the section 1 not the view port
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // SCROLLING MODERN AND EASIEST WAY
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// ******  ********

//  ************************************************//
// *********** PAGE NAVIGATION  *************
// **** SCROLLING THROUGH THE SECTIONS******
//************************************************

// The function below is not the best case scenario when it comes for long pages with many sections. We should use event delegation instead.
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     // to prevent the click to go to the section on the link
//     e.preventDefault();
//     // console.log('link');

// To check the HTML attribute we're dealing with
//     const id = this.getAttribute('href');
//     console.log(id);

// After getting the specific section we can implement the scrollIntoView directly to the section gotten from the ct id above and indicate the behavior scroll smooth:
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// EVENT DELEGATION:
// 01 - Add addEventListener to the common parent element
// 02 Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy - ignore clicks which don't happen on the target clicks:
  if (e.target.classList.contains('nav__link')) {
    // We can no longer use 'this.', we should indicate the element target, which was clicked. ->const id = this.getAttribute('href')<-;
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ************************************************
//  *********** TABBED COMPONENT  *************
// *******Changing tabs and contents**********  ************************************************

// Basically we work with classes adding and removing in order to change the elements displayed.

const tabs = document.querySelectorAll('.operations__tab');

const tabsContainer = document.querySelector('.operations__tab-container');

const tabsContent = document.querySelectorAll('.operations__content');

// Event delegation -> listener attached to the common parent

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  // Guard clause - if there's no click, the function will finish and prevent the null and the error to take place if it's clicked outside the target.
  if (!clicked) return;

  // Remove the tab--active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // Remove the content--active class
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate TAB
  clicked.classList.add('operations__tab--active');

  // Activate CONTENT AREA
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//  ************************************************//
// *** MENU FADING ANIMATION ***
// ************************************************
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler:
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// ************************************************//
// *** STICK NAV BAR ***
//***********************************************/
const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

console.log(navHeight);

const stickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//  ************************************************//
// *** REVEALING ELEMENTS WHEN SCROLLING***
//**************************************************/

const allSections = document.querySelectorAll('.section');

const revealSections = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

// Add the hidden--section CSS class to the 4 sections. All them will be hidden after it.
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//  ************************************************//
// *** LAZY LOADING IMGS ***
//**************************************************/

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observe.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//  ************************************************//
// *** SLIDER ***
//**************************************************/
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

const dotContainer = document.querySelector('.dots');

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateDot(0);

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

// Next slide:

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  console.log(e);

  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;

    goToSlide(slide);
    activateDot(slide);
  }
});

//  ************************************************//
// *** SELECTING HTML ELEMENTS ***
//**************************************************/

// For the following three elements we can access as below:
// To select the whole DOM (the entire HTML document):
// console.log(document.documentElement);

// // To select the HEAD:
// console.log(document.head);

// // To select the BODY:
// console.log(document.body);

// // If we want to access any other elements:
// const headerEl = document.querySelector('.header');

// When we have multiple classes with the same element, we can access all of them as below:
// const allSections = document.querySelectorAll('.section');

// console.log(allSections);

// // To get elements considering ID:
// document.getElementById('section--1');

// To get elements considering the HTML tag name:
// const allButtons = document.getElementsByTagName('button');

// console.log(allButtons);

// To get elements considering CLASS NAME given:
// console.log(document.getElementsByClassName('btn'));

// ************************************************//
// *** CREATING AND INSERTING ELEMENTS ***
//**************************************************/

//use .insertAdjacentHTML when you want to add to existing HTML in an element. eg: insert something inside an existent DIV.

// We use .innerHTML if we want to start from scratch with our own HTML. eg: create a new DIV block as below.

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality.';

// message.innerHTML =
//   'We use cookies for improved functionality. <button class="btn btn--close-cookie">Got it! </button>';

//prepend add the new div as the first child of the header
//headerEl.prepend(message);

// last child of the header. It can be in only one place. on the top or on the bottom
// headerEl.append(message);

//In order to make the new element appear on the top and on the bottom we need to clone it:
//headerEl.append(message.cloneNode(true));

//On the TOP of the header
//headerEl.before(message);

//On the bottom of the header
//headerEl.after(message);

// ************************************************//
// *** DELETING ELEMENTS ***
//**************************************************/

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// ************************************************//
// *** STYLES ELEMENTS ***
//**************************************************/

// In line style, inside the HTML file
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// To get property when the style was inserted in line, inside the HTML file:
// console.log(message.style.color); // We don't get the return of this property because it either doesn't exist it is outside the HTML file (css)

// The example below we get on the console because we inserted manually on above, which became a inline element inside the HTML
// console.log(message.style.backgroundColor);

// If we really want to get the style independ on if it's inline or not, we can use the property getComputedStyle. Even when we don't declare the property, the browser return the one it calculated itself.
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// To change CSS properties in root:
// ('--color-primary', 'orangered') the element to be changed and the property to change
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));

// // Set attribute
// logo.setAttribute('company', 'Bankist');

// const link = document.querySelector('.nav__link--btn');

// // Get the relative attribute:
// console.log(logo.getAttribute('src'));
// console.log(link.getAttribute('href'));

// // Get the absolute attribute:
// console.log(logo.src);
// console.log(link.href);

// // Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// Mouse hover event
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You`re on the Header');

// To make the event show up once, we need to add the function below in order to remove it after executed.
// h1.removeEventListener('mouseenter', alertH1);
// };

// Other way to remove the event listener:
// It can be placed outside the function:
// h1.removeEventListener('mouseenter', alertH1);
// Set when the listener should be removed

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// The modern way of adding event listener
// h1.addEventListener('mouseenter', function (e) {
//   alert('addEventListener: Great');
// });

// h1.addEventListener('mouseenter', alertH1);

// Old school:
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You`re on the Header');
// };

// Remove event listener:

// // CREATING RANDOM COLOR
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   // Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// *** GOING THROUGH PARENTS, CHILDREN AND SIBLINGS

// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));

// // It gives every single node inside
// console.log(h1.childNodes);

// // It gives the HTML collection
// console.log(h1.children);

// // It allows us to modify properties of a child
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parents
// console.log(h1.parentNode);

// // Closest is the opposite of querySelector. It finds the parents
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: selecting siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// Alert for users before closing the page, to check if they're sure about it.
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// });
