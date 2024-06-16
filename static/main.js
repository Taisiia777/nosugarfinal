Telegram.WebApp.ready();

const initData = Telegram.WebApp.initData || '';
const initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};

const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0

const images = ["static/images/Rectangle 5.png", "static/images/Rectangle 38.png", "static/images/Rectangle 39.png", "static/images/Rectangle 40.png",]
const product1 = [
    "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики", "Цыпленок, ароматный лаваш, фирменный соус, томаты, свежий огурец, капуста",
]
const products = [
    {
        name: "Кавказская",
        L: "239₽",
        XL: "289₽",
        XXL: "349₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 5.png",
        imgLg: "static/images/Rectangle 5 (1).png",

    },
    {
        name: "Гавайская",
        L: "179₽",
        XL: "219₽",
        XXL: "259₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 38.png",
        imgLg: "static/images/Rectangle 5 (1).png",

    },
    {
        name: "Вегетарианская",
        L: "239₽",
        XL: "289₽",
        XXL: "349₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 39.png",
        imgLg: "static/images/Rectangle 5 (1).png",

    },
    {
        name: "Пикантная",
        L: "219₽",
        XL: "259₽",
        XXL: "299₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 40.png",
        imgLg: "static/images/Rectangle 5 (1).png",

    },
    {
        name: "Сырная",
        L: "219₽",
        XL: "259₽",
        XXL: "289₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 5.png",
        imgLg: "static/images/Rectangle 5 (1).png",


    },
    {
        name: "Фирменная",
        L: "229₽",
        XL: "279₽",
        XXL: "309₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 38.png",
        imgLg: "static/images/Rectangle 5 (1).png",

    },
    {
        name: "Арабская",
        L: "209₽",
        XL: "249₽",
        XXL: "279₽",
        dscr: "Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики",
        img: "static/images/Rectangle 39.png",
        imgLg: "static/images/Rectangle 5 (1).png",

    },
]
let imageIndex = 0;
let descrIndex = 0;

$('body').css('visibility', '');

const mainButton = Telegram.WebApp.MainButton;
mainButton.hide()
mainButton.setParams({
    color: "#020405",
    text_color: "#fff",
})

const underLogo = $("#under-logo1")
const mainLogo = $("#main-logo1")
underLogo.hide()
mainLogo.hide()
const underLogo1 = $("#under-logo")
const mainLogo1 = $("#main-logo")

const mainLogoBack = $(".back-orange")
const headerAdressList = $("#address-list-header")

const backButton = $("#back-button")
const backButtonAddress = $("#back-button-address")
backButton.hide()
backButtonAddress.hide()

// const step1SelectCity = $("#step1-select-city")
const step2SelectDot = $("#step2-select-dot")
const step3Menu = $("#step3-menu")
const step31SelectProduct = $("#step3-1-select-product")
const step4Basket = $("#step4-basket")
const step5Pay = $("#step5-pay")
const step6Confirm = $("#step6-confirm")
const burger = $(".hamburger-menu")
const headerReferal = $('.header__referal')
const headerReferalPoints = $('.header__referal-points')
const backOrange = $('.back-orange')
const sumEl = $('.sum__value')
const sumDiv = $('.sum')
const basketHtml =  $('#basket')
const basketTime = $('.pickup_time')
const payMethod = $('.pay_method')
const basketAdr = $('.adress_deliv-point') 
const step3ProductImg = $('#step3-1-select-product-img')
const step3ProductName = $('#step3-1-select-product-name')
const step3ProductDescr = $('#step3-1-select-product-descr')
const historySection = $('#history-section')
let selectedPoint;
let menuItems;
let currentProductName = '';
let productPrice = 0
let curPage = 1
let basket = []
let selectedPointName;
let bonuses;
let sumOfBusket;
let orderId = 0;
let points = 0
let time_data = []
// let selectedPointTime;
// let selectedPointPhone;

var addresses = [
    { coords: [56.516417, 84.979521], address: "проспект Мира, 23", id: "11e69731-49c2-48d0-9472-6d12e651b0f1", phone: "+7‒952‒183‒29‒58", time: "с 10 до 23"},
    { coords: [56.475896, 84.970071], address: "проспект Фрунзе, 57", id: "37896d59-5f56-4204-aba2-00ba7bf0e98c", phone: "+7‒901‒611‒53‒17", time: "Круглосуточно" },
    { coords: [56.479854, 84.981138], address: "Комсомольский проспект, 39/4", id: "3e06a579-6f60-49e3-a093-b3b685ba92c3", phone: "+7‒952‒182‒00‒13", time: "с 10 до 23"},
    { coords: [56.512265, 85.040328], address: "Иркутский тракт, 118/1", id: "6bbd7086-4e8c-4023-b9a5-827d407f88cc", phone: "+7‒900‒922‒91‒23", time: "с 10 до 23"},
    { coords: [56.475735, 84.981890], address: "Комсомольский проспект, 56г", id: "73936ccf-fae1-4c1b-a566-b9204aca4a21", phone: "+7‒900‒922‒91‒23", time: "Круглосуточно" },
    { coords: [56.504343, 85.011438], address: "Иркутский тракт, 44", id: "74d1f27b-47b8-4c8b-8141-04edbe2baea4", phone: "+7‒913‒108‒12‒91", time: "с 10 до 23" },
    { coords: [56.513532, 85.024275], address: "улица Сергея Лазо, 1Б", id: "768e3aed-3473-4561-8d59-2b3b8f4ee3da", phone: "+7‒952‒899‒20‒77", time: "с 10 до 23" },
    { coords: [56.493442, 84.948942], address: "переулок 1905 года, 7В", id: "a4e189be-4e20-40d5-ac2a-bb3906272270", phone: "+7‒953‒925‒84‒43", time: "с 10 до 23"},
    { coords: [56.464227, 84.965840], address: "Красноармейская улица, 114", id: "c0ae613b-356a-4bbc-8bcc-2c97ec65a33b", phone: "+7‒913‒109‒85‒84", time: "с 10 до 23" },
    { coords: [56.509931, 84.978497], address: "улица 79-й Гвардейской Дивизии, 12", id: "e2e7b1fe-0a8f-4ac7-a39b-2ead0ff7133d", phone: "+7‒952‒885‒61‒54", time: "с 10 до 23" },
    { coords: [56.451782, 84.974248], address: "улица Фёдора Лыткина, 16/1", id: "fcb472e4-40a0-4e4e-b29c-89f4b0c3cb77", phone: "+7‒952‒887‒02‒07", time: "Круглосуточно" },  
];
ymaps.ready(init);

    var myMap;
    var selectedAddress;

    function init() {
        myMap = new ymaps.Map("map", {
            center: [56.484645, 84.947649],
            zoom: 11,
        });
    
        addresses.forEach(function(item) {
            const active = isActive(item.time);
            var placemark = new ymaps.Placemark(item.coords, {
                hintContent: item.address,
                balloonContent: item.address
            }, {
                iconOpacity: active ? 1 : 0.5,
                hasBalloon: active,
                hasHint: active
            });
    
            myMap.geoObjects.add(placemark);
    
            if (active) {
                placemark.events.add('click', function () {
                    selectedAddress = item.address;
                    selectedPoint = item.id;
                    selectedPointName = selectedAddress;
                    // selectedPointTime = item.time;
                    // selectedPointPhone = item.phone;
                    mainButton.show();
                    mainButton.setText(selectedAddress);
                });
            }
        });
    }
    function isActive(time) {
        if (time === "Круглосуточно") return true;
        
        const [start, end] = time.match(/\d+/g).map(Number);
        const now = new Date();
        const currentHour = now.getUTCHours() + 7; // Томск - UTC+7
    
        return currentHour >= start && currentHour < end;
    }
    function showPreloader() {
        document.getElementById('preloader').style.visibility = 'visible';
    }
    
    function hidePreloader() {
        document.getElementById('preloader').style.visibility = 'hidden';
    }
function openMap() {
        document.getElementById("near").classList.add("active")
        document.getElementById("all").classList.remove("active")
        document.getElementById("address-list").style.display = "none";
        document.getElementById("map").style.display = "flex";

    }
    function closeMap() {
        document.getElementById("near").classList.remove("active")
        document.getElementById("all").classList.add("active")
        document.getElementById("address-list").style.display = "flex";
        document.getElementById("map").style.display = "none";

    }
    function openHistory() {
        document.getElementById("sidePanel1").style.width = "100%";
    }
    function closeHistory() {
        document.getElementById("sidePanel1").style.width = "0";
    }

function openMenu() {
    document.getElementById("sidePanel").style.width = "100%";
    const phone = $("#dashboard-phone")
    const time = $("#dashboard-time")

    addresses.forEach(function(item) {
        if(selectedPoint === item.id){
            phone.text(item.phone);
            time.text(item.time);
        }
    })
    $.ajax('/getDots', {
        type: 'POST',
        data: {
            _auth: initData,
            userId: initUserId,
        },
        dataType: 'json',
        beforeSend: function() {
            showPreloader();
        },
        success: function (result) {
            if (result.dots) {
                const addressesListMain = $("#address-list-menu");
            
                for (const dot of result.dots) {
                    // Проверяем, равен ли id точки значению selectedPoint для установки атрибута selected
                    var isSelected = dot.id === selectedPoint ? 'selected' : '';
                    
                    addressesListMain.append(`
                        <option value="${dot.id}" id="${dot.id}" ${isSelected}>${dot.name}</option>
                    `);
                }
            
                addressesListMain.on("change", function (e) {
                    selectedPoint = e.target.value;
                    selectedPointName = $(`#${selectedPoint}`).text(); // Получаем имя из выбранного option
                });
            }
            hidePreloader();

        },
        error: function (xhr) {
            hidePreloader();

            // $('#webview_data_status').html('Server error').addClass('err');
        }
    });
    
}

function closeMenu() {
    document.getElementById("sidePanel").style.width = "0";
}
function webviewClose() {
    Telegram.WebApp.close();
}

function goNext() {
    goToPage(curPage + 1)
}

function openCart() {
    const cartItems = step4Basket.find('.step6cart-items');
    const cartSvg = document.getElementById('opencartsvg');

    if (cartItems.css('display') === 'none' || cartItems.css('display') === '') {
        cartItems.css('display', 'flex');
        cartSvg.classList.remove('not-rotated');
        cartSvg.classList.add('rotated');
    } else {
        cartItems.css('display', 'none');
        cartSvg.classList.remove('rotated');
        cartSvg.classList.add('not-rotated');
    }
}


function goToPage(step) {
    // TODO:
    if (step == 32) {
        step = 3
        addToBasket()
    }
    curPage = step
    mainButton.hide()
    underLogo.hide()
    backButton.hide()
    backButtonAddress.hide()
    hideAllPages()
    switch (parseInt(step)) {
        default:
        case 2:
            underLogo1.css('display', 'none');
            mainLogo1.css('display', 'none');
            underLogo.css('display', 'flex');
            mainLogo.css('display', 'flex');
             underLogo.css('font-size', '14px');
            mainLogo.css('font-size', '30px');
            underLogo.css('margin-left', '2px');
            mainLogo.css('margin-left', '20px');
            mainLogo.css('margin-top', '15px');
            step2SelectDot.show()
            mainButton.setText('Точка выбрана')
            break;
        case 3:
            underLogo1.css('display', 'none');
            mainLogo1.css('display', 'none');
            underLogo.css('display', 'flex');
            mainLogo.css('display', 'flex');
            underLogo.css('font-size', '14px');
            mainLogo.css('font-size', '30px');
            underLogo.css('margin-left', '2px');
            mainLogo.css('margin-left', '20px');
            mainLogo.css('margin-top', '15px');
            mainLogoBack.css('height', '150px')
            headerAdressList.css('display', 'flex')
            renderMenu()
            step3Menu.show()
            step3Menu.css('margin-top', '100px')
            burger.css('display', 'flex')
            headerReferal.css('display', 'flex')
            backOrange.css('display', 'flex');
            headerReferalPoints.css('display', 'flex');
            recalculateBasket()
            // if(mainButton.text === 'Текущий заказ №'+orderId){
            //     alert(mainButton.text)
            // }
            break;
        case 31:
            underLogo1.css('display', 'none');
            mainLogo1.css('display', 'none');
            underLogo.css('display', 'none');
            mainLogo.css('display', 'none');
            step31SelectProduct.show()
            backButton.show()
            mainButton.setText('Выбрать')
            break;
        case 4:
            underLogo1.css('display', 'none');
            mainLogo1.css('display', 'none');
            underLogo.css('display', 'none');
            mainLogo.css('display', 'none');
            burger.css('display', 'flex')
            headerReferal.css('display', 'flex')
            backOrange.css('display', 'flex');
            headerReferalPoints.css('display', 'flex');
            step4Basket.show()
            backButton.show()
            mainButton.setText('Оформить заказ')
            renderBasket()
            break;
        case 5:
            underLogo1.css('display', 'none');
            mainLogo1.css('display', 'none');
            underLogo.css('display', 'none');
            mainLogo.css('display', 'none');
            burger.css('display', 'flex')
            headerReferal.css('display', 'flex')
            backOrange.css('display', 'flex');
            headerReferalPoints.css('display', 'flex');
            step4Basket.show()
            backButton.show()
            mainButton.setText('Оформить заказ')
            basketHtml.css('display', 'none');
            basketTime.css('display', 'flex');
            payMethod.css('display', 'flex');
            sumDiv.css('display', 'none');
            renderBasket()
            break;
        case 6:
            goToPay()
            break;
        case 7:
            underLogo1.css('display', 'none');
            mainLogo1.css('display', 'none');
            underLogo.css('display', 'none');
            mainLogo.css('display', 'none');
            burger.css('display', 'flex')
            headerReferal.css('display', 'flex')
            backOrange.css('display', 'flex');
            headerReferalPoints.css('display', 'flex');
            step4Basket.show()
            step4Basket.css('margin-top', '160px');
            backButton.show()
            mainButton.setText('Оформить заказ')
            basketHtml.css('display', 'none');
            basketTime.css('display', 'flex');
            payMethod.css('display', 'flex');
            sumDiv.css('display', 'none');
            if (orderId != 0) {
                // Заблокировать изменения для select элементов
                $('#pickup_time').prop('disabled', true);
                $('#payment_method').prop('disabled', true);
            } else {
                // Разблокировать изменения для select элементов, если нужно
                $('#pickup_time').prop('disabled', false);
                $('#payment_method').prop('disabled', false);
            }
    
            renderBasket()
            step6Confirm.show()
            backButton.hide()
            // mainButton.hide()
            break
    }
}

function goToPay() {
    const inputPoints = $("input[name=points]").val()
    const paymentMethod = document.getElementById("payment_method").value
    if (inputPoints < 0 || inputPoints > points) {
        alert("Введите корректное значение баллов")
        goToPage(5)
    } else {
        let pickupTime = document.getElementById("pickup_time").value;
        $.ajax('/createOrder', {
            type: 'POST',
            data: {
                _auth: initData,
                userId: initUserId,
                points: "0",
                selectedPoint: selectedPoint,
                basket: JSON.stringify(basket),
                pickup_time: pickupTime,
                payment_method: paymentMethod,
            },
            dataType: 'json',
            beforeSend: function() {
                showPreloader();
            },
            success: function (result) {
                
                orderId = result["orderid"] 
                if (result["sum"] && result["orderid"] && result["phone"]&& result["description"]&& paymentMethod === "online") {
                    
                    const payBtn = $("#payBtn")
                    // payBtn.attr("data-pk-sum", result["sum"]) TODO:!
                    payBtn.attr("data-pk-sum", 0.2)
                    payBtn.attr("data-pk-orderid", result["orderid"])
                    payBtn.attr("data-pk-clientid", result["phone"])
                    payBtn.attr("data-pk-description", result["description"])
                    payBtn.click()
                }
                goToPage(7)
                // step6Confirm.append(
                //     '<p id="step_confirm">Ваш заказ оформлен, ожидаем вас на ' + selectedPointName + ' в ' + pickupTime + '</p>'
                // )
                hidePreloader();

            },
            error: function (xhr) {
                hidePreloader();

                // alert("Status: " + xhr.status + "\n" + 
                // "Status Text: " + xhr.statusText + "\n" + 
                // "Response Text: " + xhr.responseText + "\n" + 
                // "Ready State: " + xhr.readyState);
                // $('#webview_data_status').html('Server error').addClass('err');
            }
        });
    }
}

function renderMenu() {
    if (selectedPoint) {
        
        $.ajax('/getMenu', {
            type: 'POST',
            data: {
                _auth: initData,
                selectedPoint: selectedPoint,
                userId: initUserId,
            },
            dataType: 'json',
            beforeSend: function() {
                showPreloader();
            },
            success: function (result) {

                if (result["products"]) {
                    menuItems = result["products"]
                    const menuNode = $("#step3-menu-items")
                    // TODO:
                    menuNode.empty();

                    for (const product of result["products"]) {
                        const currentProduct = products.find(p => p.name === product["name"]);
                        menuNode.append(`
                            <div class="item" id="${product["id"]}" onclick="goToChange('${product["id"]}')">
                                <img style="width: 100%; height: 150px" src="${currentProduct.img}" alt="${product["name"]}">
                                <div class="item-footer">
                                    <p class="item__title">${product["name"]}</p>
                                    <p class="item__descr">${currentProduct.dscr}</p>
                                    <ul class="item__sizes">
                                    
    <li class="item__size">
        <p class="size__label">
            L
        </p>
        <p class="size__weigh">
        300г
        </p>
        <p class="size__price">
        ${product["sizes"][0]["price"]}₽
        </p>
    </li>
    <li class="item__size">
        <p class="size__label">
            XL
        </p>
        <p class="size__weigh">
        400г
        </p>
        <p class="size__price">
       ${product["sizes"][1]["price"]}₽
        </p>
    </li>
    <li class="item__size">
        <p class="size__label">
            XXL
        </p>
        <p class="size__weigh">
        500г
        </p>
        <p class="size__price">
        ${product["sizes"][2]["price"]}₽
        </p>
    </li>
</ul>

                                    <button class="select-product">Выбрать</button>
                                </div>
                            </div>
                        `);
                        imageIndex = (imageIndex + 1) % images.length; // Cycle through images repeatedly
                        descrIndex = (descrIndex + 1) % product1.length; // Cycle through images repeatedly
                    }
                }
                hidePreloader();

            },
            error: function (xhr) {
                hidePreloader();

                // $('#webview_data_status').html('Server error').addClass('err');
            }
        });
    }
    $.ajax('/get_orders_by_user', {
        type: 'POST',
        data: {
            _auth: initData,
            userId: initUserId,  // Используем user_id вместо userId
        },
        dataType: 'json',
        beforeSend: function() {
            showPreloader();
        },
        success: function(result) {
            hidePreloader();
    
            if (result["ok"]) {
                let orders = result["orders"];
    
                
                $('#history-section').empty(); // Очистить предыдущий контент, если нужно
               
                orders.reverse().forEach((item) => {
                    let address = addresses.find(addr => addr.id === item.dot);
                    let orderContent = JSON.parse(item.order_content); // Parse the order_content string

                    $('#history-section').append(`
                    <div class="popup__bonuses" style="background: #fff; box-shadow: 0px 3px 12px 0px #0000001A;">
                     <h2 style="position: relative;height: 60px;border-bottom: 2px solid #E7E7E7; color: #F16522; max-width: 200px; display: flex; flex-direction: column; align-items: flex-start; min-width: 300px">
    ${item.pickup_time}
    <p style="font-size: 12px; font-weight: 400; line-height: 11.94px; text-align: left; color: #000; margin-top: 10px; margin-bottom: 10px;">
        ${address.address}
    </p>
     <p style="
font-size: 18px;
font-weight: 700;
line-height: 21.09px;
text-align: left;
display:flex;
position: absolute;
top: -15px;
right: 20px;
color: #000
">
        ${item.summ} ₽
    </p>
    
</h2>

                        <div class="popup-ref-program" style="background: #fff;">
                           ${orderContent.map(content => {
                            let sizeMatch = content.size.match(/([A-Z]+)(\d+г)(\d+₽)/);
                            let size = sizeMatch ? sizeMatch[1] : '';
                            let weight = sizeMatch ? sizeMatch[2] : '';
                            let price = sizeMatch ? sizeMatch[3] : '';
                            return `
                            <div style="position: relative">
                                <p style="font-size: 14px; font-weight: 700; line-height: 13.93px; text-align: left; max-width: 200px">
                                    ${content.name}
                                </p>
                                <p style="position: absolute; top: 0px; left:120px; font-size: 14px; font-weight: 700; line-height: 13.93px; text-align: left; max-width: 200px">
                                    ${size}
                                </p>
                                <p style="position: absolute; top: 0px; left:150px; font-size: 14px; font-weight: 400; line-height: 13.93px; text-align: left; max-width: 200px">
                                    ${weight}
                                </p>
                                <p style="position: absolute; top: 0px; right:50px; font-size: 14px; font-weight: 400; line-height: 13.93px; text-align: left; max-width: 200px">
                                    ${content.amount}
                                </p>
                                <p style="position: absolute; top: 0px; right:0px; font-size: 14px; font-weight: 400; line-height: 13.93px; text-align: left; max-width: 200px">
                                    ${content.price} ₽
                                </p>
                                ${content.modifiers && content.modifiers.length > 0 ? `
                                    <p style="font-size: 14px; font-weight: 400; line-height: 13.93px; text-align: left; max-width: 200px">
                                        ${JSON.stringify(content.modifiers)}
                                    </p>
                                ` : ''}
                            </div>`;
                        }).join('')}
                        
                        </div>
                    </div>
                `);
                });
            } else {
                alert("Failed to retrieve orders: " + result["err"]);
            }
        },
        error: function(xhr) {
            hidePreloader();
            alert('Server error');
        }
    });
    
    
    
    $.ajax('/getDots', {
        type: 'POST',
        data: {
            _auth: initData,
            userId: initUserId,
        },
        dataType: 'json',
        beforeSend: function() {
            showPreloader();
        },
        success: function (result) {

            if (result.dots) {
                const addressesListMain = $("#address-list-header");
            
                for (const dot of result.dots) {
                    // Проверяем, равен ли id точки значению selectedPoint для установки атрибута selected
                    var isSelected = dot.id === selectedPoint ? 'selected' : '';
                    addressesListMain.append(`
                        <option value="${dot.id}" id="${dot.id}" ${isSelected}>${dot.name}</option>
                    `);
                }
            
                addressesListMain.on("change", function (e) {
                    selectedPoint = e.target.value;
                    selectedPointName = $(`#${selectedPoint}`).text(); // Получаем имя из выбранного option
                });
            }

        },
        error: function (xhr) {
            hidePreloader();

            // $('#webview_data_status').html('Server error').addClass('err');
        }
    });
    
    $.ajax('/getUserBonus', {
        type: 'POST',
        data: {
            _auth: initData,
            userId: initUserId,
            selectedPoint: selectedPoint,

        },
        dataType: 'json',
        beforeSend: function() {
            showPreloader();
        },
        success: function (result) {
            let balances = result.data.walletBalances;
    let positiveBalance = balances.find(function(balance) {
        return balance.balance > 0;
    });

    if (positiveBalance) {
        bonuses = positiveBalance.balance;
        const popupRef = $("#popup-ref-header");
        // Check if a <p> tag does not exist in popupRef
        if (popupRef.find('p').length === 0) {
            popupRef.append('<p>' + bonuses + '</p>');
        }
        const popupRef1 = $("#popup-ref");
        // Check if a <p> tag does not exist in popupRef
        if (popupRef1.find('p').length === 0) {
            popupRef1.append('<p>' + bonuses + '</p>');
        }
    } else {
        bonuses = 0;
        const popupRef = $("#popup-ref-header");
        // Check if a <p> tag does not exist in popupRef
        if (popupRef.find('p').length === 0) {
            popupRef.append('<p>' + bonuses + '</p>');
        }
        const popupRef1 = $("#popup-ref");
        // Check if a <p> tag does not exist in popupRef
        if (popupRef1.find('p').length === 0) {
            popupRef1.append('<p>' + bonuses + '</p>');
        }
    }

        },
        error: function (xhr) {
            hidePreloader();

            // $('#webview_data_status').html('Server error').addClass('err');
        }
    });

    $.ajax('/getPhone', {
        type: 'POST',
        data: {
            _auth: initData,
            userId: initUserId,
        },
        dataType: 'json',
        beforeSend: function() {
            showPreloader();
        },
        success: function (result) {

            $('#sidebar-phone').text(result.phone_number)

        },
        error: function (xhr) {
            hidePreloader();

            // $('#webview_data_status').html('Server error').addClass('err');
        }
    });
}

function goToChange(productId) {
    const sizeOptions = $("#sizeOptions");
    const additionalOptions = $("#additionalOptions");
    sizeOptions.empty();
    additionalOptions.empty();

    let modifiersMap = new Map();
    const sizeWeights = [300, 400, 500];

    for (const menuItem of menuItems) {
        if (menuItem["id"] == productId) {
            // Раздел для размеров

            currentProductName = menuItem["name"]
            step3ProductName.text(currentProductName);
            const currentProduct = products.find(p => p.name === currentProductName);
            step3ProductImg.attr('src', currentProduct.imgLg);
            step3ProductDescr.text(currentProduct.dscr);

            let index = 0
            menuItem["sizes"].forEach(size => {
                sizeOptions.append(`
                <div class="size-option" id="${size["id"]}" price="${size["price"]}" onclick="selectSize(this)">${size["name"]}<div><p class="size-weight">${sizeWeights[index]}г</p><p class="size-price">${size["price"]}₽</p></div></div>
                `);
                index++
            });

            // Обработка модификаторов
            menuItem["modifiers"].forEach(modifier => {
                let parts = modifier["name"].split(' ');
                // Detect and remove the weight from the parts if the last part is a weight
                let weight = parts[parts.length - 1] ? parts.pop() : "";
                let modifierName = parts.join(' ');  // This now joins the name parts without the weight
            
                if (!modifiersMap.has(modifierName)) {
                    modifiersMap.set(modifierName, []);
                    additionalOptions.append(`<h3 class="modifiers__title">${modifierName}</h3><ul class="modifiers__list"></ul>`);
                }
            
                let ul = additionalOptions.find('ul').last();
                modifiersMap.get(modifierName).push({...modifier, weight});
            
                let displayText = ``;
                let price = ``;
                if (weight) {
                    displayText += `${weight} `;
                    price += `+${modifier["price"]}₽`
                }
                ul.append(`
                    <p class="additional-option" id="${modifier["id"]}" price="${modifier["price"]}" onclick="selectAdditional(this)">
                        ${displayText}
                        <span class="modifiers__price">
                        ${price}
                        </span>
                    </p>
                `);
            });
            
            
            
        }
    }
    goToPage(31);
}




function selectSize(el) {
    const sizePrice = $(el)[0].getAttribute("price")
    productPrice = parseInt(sizePrice)
    $(".additional-option.active").each(function () {
        productPrice += parseInt($(this)[0].getAttribute("price"))
    })
    $(".size-option").removeClass("active")
    $(el).addClass("active")
    updatePriceMainButton(parseInt(productPrice))
    mainButton.show()
}

function selectAdditional(el) {
    const additionalPrice = $(el)[0].getAttribute("price")
    if ($(el).hasClass("active")) {
        $(el).removeClass("active")
        productPrice -= parseInt($(el)[0].getAttribute("price"))
    } else {
        $(el).addClass("active")
        productPrice += parseInt($(el)[0].getAttribute("price"))
    }
    updatePriceMainButton(parseInt(productPrice))
}

function updatePriceMainButton(price) {
    mainButton.setText("Положить в корзину " + parseInt(price) + "р")
}

function addToBasket() {
    let elPrice = 0
    let size = ''
    let sizeId = ''
    let additional = []
    $(".size-option.active").each(function () {
        size = $(this).text()
        sizeId = $(this)[0].getAttribute("id")
        elPrice += parseInt($(this)[0].getAttribute("price"))
    })
    $(".additional-option.active").each(function () {
        additional.push({
            name: $(this).text(),
            elId: $(this)[0].getAttribute("id")
        })
        elPrice += parseInt($(this)[0].getAttribute("price"))
    })

    $(".size-option").removeClass("active")
    $(".additional-option").removeClass("active")
    basket.push({
        id: Date.now(),
        name: currentProductName,
        size: size,
        sizeId: sizeId,
        price: elPrice,
        additional: additional,
    })
}

function recalculateBasket() {
    if (basket.length > 0) {
        let basketSum = 0
        for (const basketElement of basket) {
            basketSum += basketElement.price
        }
        if(orderId === 0){
            mainButton.setText(`Корзина ${basketSum}р`)
            mainButton.show()
        }else{
            mainButton.setText('Текущий заказ №' + orderId)
            mainButton.show()
        }
       
    }
}
function recalculatePay() {
    if (basket.length > 0) {
        let basketSum = 0
        for (const basketElement of basket) {
            basketSum += basketElement.price
        }
        burger.css('display', 'none')
            headerReferal.css('display', 'none')
            backOrange.css('display', 'none');
            headerReferalPoints.css('display', 'none');
            headerAdressList.css('display', 'none')
            
            sumEl.html(`${basketSum} ₽`);
            sumOfBusket = basketSum
        // mainButton.setText(`Оформить заказ на ${basketSum}р`)
        if (parseInt(curPage) === 7) {
            mainButton.setText(`Свернуть`)

        }else{
            mainButton.setText(`Оформить`)

        }

        mainButton.show()
    } else {
        mainButton.hide()
    }
}

function renderBasket() {
    $.ajax('/getPoints', {
            type: 'POST',
            data: {
                _auth: initData,
                basket: JSON.stringify(basket),
                userId: initUserId,
                selectedPoint: selectedPoint,
            },
            dataType: 'json',
            beforeSend: function() {
                showPreloader();
            },
            success: function (result) {

                const basketNode = $("#basket")
                const pickupTimeSelect = $("#pickup_time")
                time_data = result.time_data

                basketNode.empty();

                // if (result.points && result.points > 0) {
                    if (parseInt(curPage) === 5) {
                        basketAdr.html(`${selectedPointName}`);
                        points = result.points;
                       
            
                        step4Basket.append(`
                            <div class="el-bonus">
                                <div class="top" >
                                    <p class="title">Мои бонусы:</p>
                                    <p class="price">${result.points}</p>
                                </div>
                                <div class="additional">
                                    <p>Оплатить бонусами:</p>
                                    <label class="switch">
                                        <input type="checkbox" id="usePoints" name="points">
                                        <span class="slider round"></span>
                                    </label>
                                    <input type="hidden" id="pointsValue" name="pointsValue" value="0">
                                </div>
                                <div class="sum-total-div">

                                <div class="sum-total">
                                    <div class="sum-total-pure">
                                        ${sumOfBusket}
                                    </div>
                                    <div class="sum-total-bonuses">
                                        0
                                    </div>
                                    <div class="sum-total-get-bonuses">
                                        0
                                    </div>
                                </div>
                                <div class="sum-total1">
                                <div class="sum-total-pure1">
                                Сумма заказа
                                </div>
                                <div class="sum-total-bonuses1">
                                Списано бонусов
                                </div>
                                <div class="sum-total-get-bonuses1">
                                Начислено бонусов
                                </div>
                                </div>
                            </div>
                                <div class="sum-total-total">
                                    <h2>Итого</h2>
                                    <p class="sum-total-total-sum">
                                        ${sumOfBusket}
                                    </p>
                                </div>
                            </div>
                        `);
                       
                        // Handle checkbox change event
                        $('#usePoints').change(function() {
                            const bonusesElement = $('.sum-total-bonuses');
                            const totalSumElement = $('.sum-total-total-sum');
            
                            if (this.checked) {
                                $('#pointsValue').val(result.points);
                                bonusesElement.text(result.points);
                                totalSumElement.text(sumOfBusket - result.points);
                            } else {
                                $('#pointsValue').val(0);
                                bonusesElement.text(0);
                                totalSumElement.text(sumOfBusket);
                            }
                        });
                    }
                    if (parseInt(curPage) === 7) {
                        mainButton.setText('Свернуть')
                        basketAdr.html(`${selectedPointName}`);
                        points = result.points;
                        $('#orderId').html(`${orderId}`);
                        // Удалить старый элемент с классом el-bonus
                        step4Basket.find('.el-bonus').remove();
                    
                        // Добавить новый элемент с классом el-bonus
                        step4Basket.append(`
                        <div class="el-bonus" style="border-bottom: none">
                        <div class="top" style="display: none">
                            <p class="title">Мои бонусы:</p>
                            <p class="price">${result.points}</p>
                        </div>
                        <div class="additional" style="display: none">
                            <p>Оплатить бонусами:</p>
                            <label class="switch">
                                <input type="checkbox" id="usePoints" name="points">
                                <span class="slider round"></span>
                            </label>
                            <input type="hidden" id="pointsValue" name="pointsValue" value="0">
                        </div>
                        <div class="step6cart" onclick="openCart()">
                        <div class="step6cart-button">
                        <p>Состав заказа</p>
                        <svg id="opencartsvg" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 1L7 7L1 0.999999" stroke="black" stroke-width="2"/>
                        </svg>
                        </div>
                        
                        <div class="step6cart-items" id="basket1" style="display: none">
                        
                        
                        </div>
                        </div>
                        <div class="sum-total-div">
                        <div class="sum-total">
                        <div class="sum-total-pure">
                            ${sumOfBusket}
                        </div>
                        <div class="sum-total-bonuses">
                            0
                        </div>
                        <div class="sum-total-get-bonuses">
                            0
                        </div>
                    </div>
                    <div class="sum-total1">
                    <div class="sum-total-pure1">
                    Сумма заказа
                    </div>
                    <div class="sum-total-bonuses1">
                    Списано бонусов
                    </div>
                    <div class="sum-total-get-bonuses1">
                    Начислено бонусов
                    </div>
                        </div>
                        
                    </div>
                        <div class="sum-total-total">
                            <h2>Итого</h2>
                            <p class="sum-total-total-sum">
                                ${sumOfBusket}
                            </p>
                        </div>
                    </div>
                        `);
                    
                        // Обработчик события изменения состояния чекбокса
                        $('#usePoints').change(function() {
                            const bonusesElement = $('.sum-total-bonuses');
                            const totalSumElement = $('.sum-total-total-sum');
                    
                            if (this.checked) {
                                $('#pointsValue').val(result.points);
                                bonusesElement.text(result.points);
                                totalSumElement.text(sumOfBusket - result.points);
                            } else {
                                $('#pointsValue').val(0);
                                bonusesElement.text(0);
                                totalSumElement.text(sumOfBusket);
                            }
                        });
                    }
                    
               
                // }

                for (const basketEl of basket) {
                    let isHideAdditionalBlock = true
                    let additionalTextLine = ''
                    for (const additionalElement of basketEl.additional) {
                        if (additionalElement.name) {
                            isHideAdditionalBlock = false
                            additionalTextLine += additionalElement.name + ", "
                        }
                    }
                    additionalTextLine = additionalTextLine.slice(0, -2)
                    let elSize = basketEl.size.replace(/[\d].*$/, '');
                    let elWeight = basketEl.size.replace(/^.*?(\d).*?(\d).*?(\d).*/, '$1$2$3');

                    basketNode.append(`
                        <div class="el">
                            <div class="top">
                                <img class="top__image" src="./static/images/Rectangle 22.svg" alt="">
                                <div class="top__name">
                                    <p class="title">${basketEl.name}</p>
                                    <p class="el-size">${elSize}</p>
                                    <p class="el-weight">${elWeight}г</p>

                                </div>
                                <div class="top__descr">
                                Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики
                                </div>
                                <div>
                                    <p class="price">${basketEl.price}р</p>
                                </div>
                                <div class="controllers">
                                    <button class="delete-el-from-basket" onclick="deleteFromBasket(${basketEl.id}, this)">–</button>
                                    <button class="add-el-from-basket" onclick="addFromBasket(${basketEl.id}, this)">+</button>
                                </div>
                                <div class="additional" style="${isHideAdditionalBlock ? 'display: none' : ''}">
                                <p class="additional-list">${additionalTextLine}</p>
                            </div>
                            </div>
                            

                        </div>
                    `)
                    if(document.getElementById('basket1')){
                        document.getElementById('basket1').innerHTML +=`
                        <div class="el">
                            <div class="top">
                                <img class="top__image" src="./static/images/Rectangle 22.svg" alt="">
                                <div class="top__name">
                                    <p class="title">${basketEl.name}</p>
                                    <p class="el-size">${elSize}</p>
                                    <p class="el-weight">${elWeight}г</p>

                                </div>
                                <div class="top__descr">
                                Цыпленок, ароматный лаваш, фирменный соус, сочный гранат, томаты, картофель фри, маринованные огурчики
                                </div>
                                <div>
                                    <p class="price">${basketEl.price}р</p>
                                </div>
                                <div class="controllers">
                                    <button class="delete-el-from-basket" onclick="deleteFromBasket(${basketEl.id}, this)">–</button>
                                    <button class="add-el-from-basket" onclick="addFromBasket(${basketEl.id}, this)">+</button>
                                </div>
                                <div class="additional" style="${isHideAdditionalBlock ? 'display: none' : ''}">
                                <p class="additional-list">${additionalTextLine}</p>
                            </div>
                            </div>
                            

                        </div>
                    `
                    }
                    
                }

                // for (const line_time of time_data) {
                //     pickupTimeSelect.append(`
                //         <option value="${line_time}">${line_time}</option>
                //     `)
                // }
               
                if (time_data.length === 0) {
                    alert("Точка сейчас закрыта, попробуйте заказать в другое время!");
                    mainButton.hide()
                } else {
                    for (const line_time of time_data) {
                        pickupTimeSelect.append(`
                            <option value="${line_time}">${line_time}</option>
                        `);
                    }
                }

                recalculatePay()
                hidePreloader();

            },
            error: function (xhr) {
                hidePreloader();

                // $('#webview_data_status').html('Server error').addClass('err');
            }
        });
}

function deleteFromBasket(id, el) {
    el.parentElement.parentElement.parentElement.remove()
    let newBasket = []
    for (const basketElement of basket) {
        if (basketElement.id != id) {
            newBasket.push(basketElement)
        }
    }
    basket = newBasket
    recalculatePay()
}

// function addFromBasket(id, el) {
//     alert(id)
//     const basketNode = $("#basket")
//     let clone = el.parentElement.parentElement.parentElement.cloneNode(true);
//     basketNode.append(clone)

//     let newBasket = []
//     for (const basketElement of basket) {
//         if (basketElement.id === id) {
//             newBasket.push(basketElement)
//             newBasket.push(basketElement)
//         } else {
//            newBasket.push(basketElement)
//         }
//     }
//     basket = newBasket
//     recalculatePay()
// }
function addFromBasket(id, el) {
    const basketNode = $("#basket");

    // Проверка на наличие элемента с указанным id в корзине
    if (basketNode.find(`[data-id='${id}']`).length > 0) {
        alert("kkk")
        return; // Элемент уже существует, ничего не добавляем
    }

    // Клонирование и добавление нового элемента
    let clone = el.parentElement.parentElement.parentElement.cloneNode(true);
    clone.setAttribute('data-id', id); // Добавляем атрибут для поиска
    basketNode.append(clone);

    // Обновление корзины
    let newBasket = [];
    for (const basketElement of basket) {
        if (basketElement.id === id) {
            newBasket.push(basketElement);
            newBasket.push(basketElement);
        } else {
           newBasket.push(basketElement);
        }
    }
    basket = newBasket;
    recalculatePay();
}


$.ajax('/checkIsAuth', {
    type: 'POST',
    data: {
        _auth: initData,
        userId: initUserId,
    },
    dataType: 'json',
    beforeSend: function() {
        showPreloader();
    },
    success: function (result) {

        if (!result["isAuth"]) {
            alert("Вы не авторизованы")
            webviewClose()
        } else {
            hideAllPages = () => {
                step2SelectDot.hide()
                step3Menu.hide()
                step31SelectProduct.hide()
                step4Basket.hide()
                step5Pay.hide()
                step6Confirm.hide()
            }


            mainButton.onClick(function () {
                if(parseInt(curPage) === 7)
                    {   
                        goToPage(3)
                        mainButton.setText('Текущий заказ №' + orderId)
                    }else if(orderId === 0){
                        goNext();
                    } else {
                        goToPage(7)
                        mainButton.setText('Свернуть')
                    }

                });

            backButton.click(function () {
                goToPage(3)
            })

            backButtonAddress.click(function () {
                goToPage(2)
            })

            $.ajax('/getDots', {
                    type: 'POST',
                    data: {
                        _auth: initData,
                        userId: initUserId,
                    },
                    dataType: 'json',
                    beforeSend: function() {
                        showPreloader();
                    },
                    success: function (result) {
                        hidePreloader();

                        // if (result.dots) {
                        //     const addressesListMain = $("#address-list")

                        //     for (const dot of result.dots) {
                        //         addressesListMain.append(`
                        //             <li value="${dot.id}" id="${dot.id}">${dot.name}</li>
                        //         `)
                        //     }

                        //     $("#address-list").on("click", "li", function(e) {
                        //          selectedPoint = $(this).attr('value');  // Assuming each li has a value attribute
                        //          selectedPointName = $(this).text();
                        //              $("#address-list li").removeClass("selected");

                        //          $(this).addClass("selected");

                        //         if (selectedPoint) {
                        //             mainButton.show();
                        //             mainButton.setText(selectedPointName)
                        //         } else {
                        //             mainButton.hide();
                        //         }
                        //     });
                        //     goToPage(2)
                        // }
                        if (result.dots) {
                            const addressesListMain = $("#address-list");
                        
                            for (const dot of result.dots) {
                                const address = addresses.find(addr => addr.id === dot.id);
                                const active = isActive(address.time);
                        
                                addressesListMain.append(`
                                    <li value="${dot.id}" id="${dot.id}" class="${active ? '' : 'inactive'}" style="opacity: ${active ? '1' : '0.5'}">${dot.name}</li>
                                `);
                            }
                        
                            $("#address-list").on("click", "li", function(e) {
                                if ($(this).hasClass('inactive')) return;
                        
                                selectedPoint = $(this).attr('value');  // Assuming each li has a value attribute
                                selectedPointName = $(this).text();
                                $("#address-list li").removeClass("selected");
                                $(this).addClass("selected");
                        
                                if (selectedPoint) {
                                    mainButton.show();
                                    mainButton.setText(selectedPointName);
                                } else {
                                    mainButton.hide();
                                }
                            });
                        
                            goToPage(2);
                        }
                    },
                    error: function (xhr) {
                        hidePreloader();

                        // $('#webview_data_status').html('Server error').addClass('err');
                    }
                });
        }
        hidePreloader();

    },
    error: function (xhr) {
        hidePreloader();

        // $('#webview_data_status').html('Server error').addClass('err');
    }
});