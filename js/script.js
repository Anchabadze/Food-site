
document.addEventListener('DOMContentLoaded', () => {

    // Tabs
    
    const tabs = document.querySelectorAll('.tabheader__item'),
            tabsContent = document.querySelectorAll('.tabcontent'),
            tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });

    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent(); 
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2023-01-29';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), 
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60 % 60)),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t, 
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }   

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }
    
    function setClock(selector, endtime) {
            const timer = document.querySelector(selector),
                    days = timer.querySelector('#days'),
                    hours = timer.querySelector('#hours'),
                    minutes = timer.querySelector('#minutes'),
                    seconds = timer.querySelector('#seconds'),
                    timeInterval = setInterval(updateClock, 1000);

            updateClock();
             
            function updateClock() {
                const t = getTimeRemaining(endtime); 

                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);

                if (t.total <=0) {
                    clearInterval(timeInterval);
                }                 
            }   
    } 

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
            modal = document.querySelector('.modal');
            

    function openModal () {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') { 
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
           closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 10000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Classes for cards

    class MenuCard { 
        constructor(src, alt, title, descr, price, parentSelector, ...classes) { 
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector); 
            this.transfer = 70; 
            this.changeToRUB();
        }

        changeToRUB() { 
            this.price = this.price * this.transfer;
        }

        render() { 
            const element = document.createElement('div'); 

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = ` 
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">????????:</div>
                    <div class="menu__item-total"><span>${this.price}</span> ??????/????????</div>
                </div>
            `;
            
            this.parent.append(element); 

        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        '???????? "????????????"',
        '???????? "????????????" - ?????? ?????????? ???????????? ?? ?????????????????????????? ????????: ???????????? ???????????? ???????????? ?? ??????????????. ?????????????? ???????????????? ?? ???????????????? ??????????. ?????? ?????????????????? ?????????? ?????????????? ?? ?????????????????????? ?????????? ?? ?????????????? ??????????????????!',
        9,
        '.menu .container',
        'menu__item',
        'big'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        '???????? "??????????????"',
        '?? ???????? "??????????????" ???? ???????????????????? ???? ???????????? ???????????????? ???????????? ????????????????, ???? ?? ???????????????????????? ???????????????????? ????????. ?????????????? ????????, ????????????????????????, ???????????? - ?????????????????????? ???????? ?????? ???????????? ?? ????????????????!',
        13,
        '.menu .container', 'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        '???????? "??????????????"',
        '???????? "??????????????" - ?????? ???????????????????? ???????????? ????????????????????????: ???????????? ???????????????????? ?????????????????? ?????????????????? ??????????????????????????, ???????????? ???? ??????????????, ????????, ???????????? ?????? ????????????, ???????????????????? ???????????????????? ???????????? ???? ???????? ???????? ?? ?????????????????? ???????????????????????????? ??????????????.',
        9, 
        '.menu .container', 'menu__item'
    ).render();

    // Forms

    const forms = document.querySelectorAll('form'); 
    const message = { 
        loading: 'img/spinner.svg',
        success: '??????????????! ?????????? ???? ?? ???????? ????????????????!',
        failure: '??????-???? ?????????? ???? ??????...'
    };

    forms.forEach(item => {
        postData(item); 
    });

    function postData(form) { 
        form.addEventListener('submit', (e) => { 
            e.preventDefault(); 

            const statusMessage = document.createElement('img'); 
            statusMessage.src = message.loading; 
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage); 
            
            const formData = new FormData(form); 

            const object = {}; 
            formData.forEach(function(value, key) { 
                object[key] = value;
            });

            fetch('server.php', { 
                method: 'POST', 
                headers: { 
                    'Content-type': 'multipart/form-data'
                },
                body: JSON.stringify(object) 
            })
            .then(data => data.text()) 
            .then(data => { 
                console.log(data); 
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => { 
                showThanksModal(message.failure); 
            })
            .finally(() => {
                form.reset(); 
            });
        });
    }

    function showThanksModal (message) { 
        const prevModalDialog = document.querySelector('.modal__dialog');

         prevModalDialog.classList.add('hide'); 
         openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('.modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal(); 
        }, 4000);
    }

    // Slider

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'), 
        next = document.querySelector('.offer__slider-next'), 
        total = document.querySelector('#total'), 
        current = document.querySelector('#current'), 
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10) { 
        total.textContent = `0${slides.length}`; 
        current.textContent = `0${slideIndex}`; 
    } else {        
        total.textContent = slides.length; 
        current.textContent = slideIndex; 
    }

    slidesField.style.width = 100 * slides.length + '%'; 
    slidesField.style.display = 'flex'; 
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden'; 
    
    slides.forEach(slide => {
        slide.style.width = width; 
    });

    slider.style.position = 'relative';

    const dots = document.createElement('ol'),
            massDots = [];

    dots.classList.add('carousel-dots');
    // dots.style.cssText = `
    //     position: absolute;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     z-index: 15;
    //     display: flex;
    //     justify-content: center;
    //     margin-right: 15%;
    //     margin-left: 15%;
    //     list-style: none;
    // `;
    slider.append(dots);

    for (let i = 0; i < slides.length; i++ ) { 
        const dot = document.createElement('li'); 
        dot.setAttribute('data-slide-to', i + 1); 
        dot.classList.add('dot');
        // dot.style.cssText = `
        //     box-sizing: content-box;
        //     flex: 0 1 auto;
        //     width: 30px;
        //     height: 6px;
        //     margin-right: 3px;
        //     margin-left: 3px;
        //     cursor: pointer;
        //     background-color: #fff;
        //     background-clip: padding-box;
        //     border-top: 10px solid transparent;
        //     border-bottom: 10px solid transparent;
        //     opacity: .5;
        //     transition: opacity .6s ease;
        // `;

        if (i == 0) { // ???????? ???????????? 0 (???????????? ??????????????????)
            dot.style.opacity = 1; // ???? ???????????????????????? 1
        }

        dots.append(dot); 
        massDots.push(dot);
    }
    
    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }


    next.addEventListener('click', () => { 
        if (offset == deleteNotDigits(width) * (slides.length - 1)) { 
            offset = 0; 
        } else { 
            offset += deleteNotDigits(width); 
        }

        slidesField.style.transform = `translateX(-${offset}px)`; 

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        massDots.forEach(dot => dot.style.opacity ='0.5');
        massDots[slideIndex - 1].style.opacity = '1'; 


    });

    prev.addEventListener('click', () => {
        if (offset == 0) { 
            offset = deleteNotDigits(width) * (slides.length - 1); 
        } else { 
            offset -= deleteNotDigits(width); 
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) { 
            slideIndex = slides.length;
        } else { 
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        massDots.forEach(dot => dot.style.opacity ='0.5'); 
        massDots[slideIndex - 1].style.opacity = '1';

        massDots.forEach(dot => { 
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');

                slideIndex = slideTo;

                offset = deleteNotDigits(width) * (slideTo - 1);

                slidesField.style.transform = `translateX(-${offset}px)`; 

                if (slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }

                massDots.forEach(dot => dot.style.opacity ='0.5'); 
                massDots[slideIndex - 1].style.opacity = '1';

            });
        });

    });

    // showSlides(slideIndex); 

    // if (slides.length < 10) { 
    //     total.textContent = `0${slides.length}`; 
    // } else { 
    //     total.textContent = slides.length; 
    // }

    // function showSlides(n) { 
    //     if (n > slides.length) { 
    //         slideIndex = 1;
    //     }

    //     if (n < 1) { 
    //         slideIndex = slides.length; 
    //     }

    //     slides.forEach(item => item.style.display = 'none');

    //     slides[slideIndex - 1].style.display = 'block';

    //     if (slides.length < 10) { 
    //         current.textContent = `0${slideIndex}`; 
    //     } else { 
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlider(n) { 
    //     showSlides(slideIndex += n); 
    // }

    // prev.addEventListener('click', () => { 
    //     plusSlider(-1);
    // });

    // next.addEventListener('click', () => { 
    //     plusSlider(1);
    // });

    // Calc

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) { 
        sex = localStorage.getItem('sex');
    } else { 
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.2;
        localStorage.setItem('ratio', 1.2);
    }


    function initLocalSettings (selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => { // ???????????????????? ???????????????? ?? ???????????????????????? div
            elem.classList.remove(activeClass); // ?????????????? ?? ?????????????? ???? ?????? ?????????? ????????????????????
            if (elem.getAttribute('id') === localStorage.getItem('sex')) { // ???????? ?????????????? id ?????????? ????????????????, ?????????????? ?????????? ?? localStorage, ????
                elem.classList.add(activeClass); // ?????????????????? ?????????? ????????????????????
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) { // ???????? ?????????????? data-ratio ?????????? ????????????????, ?????????????? ?????????? ?? localStorage, ????
                elem.classList.add(activeClass); // ?????????????????? ?????????? ????????????????????
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '_____';
            return;
        } 

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round(88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio')); 
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id')); 
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
        
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector); 

        input.addEventListener('input', () => { 

            if (input.value.match(/\D/g)) { 
                input.style.border = '1px solid red'; 
            } else { 
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) { 
                case 'height':
                    height = +input.value; 
                    break; 
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });

    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');



});

