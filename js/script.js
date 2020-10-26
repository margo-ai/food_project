'use strict';

window.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

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

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

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

    const deadline = '2020-12-31';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()); // разница в миллисекундах
        const days = Math.floor(t / (1000 * 60 * 60 * 24)); // сколько суток осталось до окончания дедлайна
        const hours = Math.floor((t / (1000 * 60 * 60) % 24));
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const seconds = Math.floor((t / 1000) % 60);

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
        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        const timeInterval = setInterval(updateClock, 1000);

        updateClock(); // чтобы таймер сразц запустился и мы не ждали секунду, иначе там сперва время из верстки

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');
    const modalCloseBtn = document.querySelector('[data-close]');

    // вариант через toggle:

    // modalTrigger.addEventListener('click', () => {
    //     // modal.classList.add('show');
    //     // modal.classList.remove('hide');
    //     modal.classList.toggle('show');
    //     document.body.style.overflow = 'hidden';
    // });

    // modalCloseBtn.addEventListener('click', () => {
    //     // modal.classList.add('hide');
    //     // modal.classList.remove('show');
    //     modal.classList.toggle('show');
    //     document.body.style.overflow = '';
    // });

    function openModal() {
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


    modalCloseBtn.addEventListener('click', closeModal);


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Если участок кода повторяется хотя бы 2 раза, то лучше вынести его в отдельную функцию (принцип DRY)

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // всплытие модального окна через 5 сек нахождения на сайте
    // const modalTimerId = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //  {once: true}  // чтобы наше событие выполнилось только один раз


    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
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
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // можно использовать такой синтаксис:
    // const div = new MenuCard();
    // div.render();

    // другой способ (мы этот объект нигде не сохраняем как переменную, испоьлзуем один раз):
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/balance.jpg",
        "balance",
        'Меню "Сбалансированное"',
        'Меню "Сбалансированное" - это соответствие вашего рациона всем научным рекомендациям. Мы тщательно просчитываем вашу потребность в к/б/ж/у и создаем лучшие блюда для вас.',
        11,
        '.menu .container',
        'menu__item'
    ).render();



    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    // осталось подвязать под каждую форму функцию postData
    forms.forEach(item => {
        postData(item);
    });

    // Но куда помещать это сообщение?
    // Очень частая практика: при отправке запроса мы создаём блок на странице,
    // куда выводим сообщение, картинку и т.д., и чаще всего он добавляется к форме

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // отменяем стандартное поведение браузера при submit, т.е. перезагрузку страницы
            // надо всегда ставить такую команду в AJAX-запросах, чтобы не было казусов

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);


            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            // можно было бы взять форму, все инпуты, взять их value,
            // перебрать, сформировать объекты, но это очень муторно. Для этого всего есть механизмы
            // Самый простой способ - объект formData .
            // Не всегда нужно передавать в формате JSON. Есть всего2 формата:
            // (1) formData
            // (2) JSON
            // В каком формате будем передавать, можно обговаривать уже непосредственно с бекендером, с которым работаем

            // formData - объект, помогающий с определенной формы быстро сформировать все данные,
            // которые заполнил пользователь (также в формате ключ-значение)

            // заголовок запроса "что именно приходит на сервер?":
            request.setRequestHeader('Content-type', 'application/json');
            // при отправке XMLHttp запроса через formData заголовок не нужен!!!

            const formData = new FormData(form); // внутрь помещаем форму, из которой нужно собрать данные 
            // !!! Важный момент!!! если мы понимаем, что данные будут отправляться на сервер,
            // то в верстке в инпуте ВСЕГДА нужно указывать атрибут name (например, name="name").
            // Иначе formData не сможет найти этот инпут, взять из него value и сформировать правильно объект

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            }); // когда мы получили обычный объект, а не Data, то уже на нём можем использовать ковертацию JSON
            const json = JSON.stringify(object);

            request.send(json); // отправляем данные на сервер; в скобочках уже есть body, и это объект formData
            request.addEventListener('load', () => { // отслеживаем конечую загрузку нашего запроса
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset(); //  очищаем форму после отправки на сервер
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000); // убираем сообщение о статусе через 2 секунды
                    setTimeout(() => {
                        closeModal();
                    }, 4000); // модальное окно закрывается через 4 секунды
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }

    // при работе на локальном сервере надо каждый раз (после каких-либо изменений) сбрасывать cash,
    // чтобы все изменения применились, так как сервер запоминает старые изменения,
    // чтобы каждый раз их не подгружать (это и называется cash)
    // Чтобы сбросить кэш, нужно использовать комбинацию клавиш: shift + F5
    
    // При отправке формы в консоли получаем array(0){}, это значит, что данные на сервер дошли (вроде как).
    // Но сервер ответил пустыми данными. Это значит, что даные до него не дошли.
    // Данные не дошли из-за заголовка (setRequestHeader).
    // !!!ВНИМАНИЕ! Когда мы используем связку "XMLHttpRequest + formData",
    // то заголовок устанавливать не нунжно, он устанавливается автоматически!!
    // Именно из-за этой проблемы у нас произошла ошибка при отправке данных.


    // Если сервер принимает данные не в обычном формате, а в JSON, то нужно немного переделать код
    // PHP нативно не умеет работать с типом данных JSON. Чаще всего такие данные
    // отправляются на сервера с использованием, например Node.js.
    // Но с таким типом данных можно работать, сделав некоторые манипуляции в php
});
