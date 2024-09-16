


  import React, { useState, useEffect, useContext } from 'react';
  import { Img, Heading, Button } from "../../components";
  import { CartContext } from '../../CartContext';
  import PopUp from '../PopUp';
  import '../../styles/ButtonStyles.css';

  const CategoryItem = ({ category, handleAddToCart, data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const [additionalItems, setAdditionalItems] = useState([]);
    const [addedItems, setAddedItems] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    // const { handleAddToCart } = useContext(CartContext);
    const [showAdditionalPopUp, setShowAdditionalPopUp] = useState(false);  // Второй попап
    const [firstModifier, setFirstModifier] = useState(null);  // Модификатор из первого попапа
    const [secondModifier, setSecondModifier] = useState(null); // Модификатор из второго попапа
    const [showAdditionalItemPopUp, setShowAdditionalItemPopUp] = useState(false);  // Второй попап

    // Исключаем определенные категории
    if (category.name === 'Альтернативное молоко' || category.name === 'Дополнительно в напитки') {
      return null;
    }

    const toggleOpen = () => {
      setIsOpen(!isOpen);
    };

    const toggleDescription = () => {
      setIsDescriptionOpen(!isDescriptionOpen);
    };

    const handleAddItemWithFirstModifier = (modifier) => {
      setFirstModifier(modifier); // Сохраняем первый модификатор
      setShowPopUp(false); // Закрываем первый попап
    
      // Проверяем, есть ли второй набор модификаторов
      if (selectedItem.itemSizes[0].itemModifierGroups[1]?.items) {
        setShowAdditionalPopUp(true); // Открываем второй попап
        setAdditionalItems(selectedItem.itemSizes[0].itemModifierGroups[1].items); // Устанавливаем дополнительные модификаторы
      } else {
        // Если второго набора нет, сразу добавляем в корзину
        const itemToAdd = {
          ...selectedItem,
          modifiers: [modifier].filter(Boolean), // Добавляем только первый модификатор
        };
        handleAddToCart(itemToAdd); // Добавляем товар в корзину
        setSelectedItem(null); // Очищаем выбранный товар
      }
    };
    const handleAddItemWithSecondModifier = (modifier) => {
      setSecondModifier(modifier); // Сохраняем второй модификатор
      // После выбора второго модификатора добавляем товар в корзину
      if (selectedItem) {
        const itemToAdd = {
          ...selectedItem,
          modifiers: [firstModifier, modifier].filter(Boolean), // Добавляем оба модификатора, если они выбраны
        };
        handleAddToCart(itemToAdd); // Добавляем товар в корзину
        setSelectedItem(null); // Очищаем выбранный товар
        setShowAdditionalPopUp(false); // Закрываем второй попап
      }
    };
    

    const handleAddAdditionalItemAsProduct = (additionalItem) => {
      // Лог для проверки структуры продукта
      
      // Безопасная проверка наличия цены для допа
      const price = additionalItem.itemSizes?.[0]?.prices?.[0]?.price || 0;
      
      // Добавляем дополнительный элемент как отдельный продукт в корзину
      const additionalProduct = {
        id: additionalItem.sku,  // Уникальный SKU для каждого продукта
        name: additionalItem.name,
        price: price,  // Цена продукта (по умолчанию 0, если не найдена)
        quantity: 1,  // Начальное количество 1
        imageUrl: additionalItem.itemSizes[0]?.buttonImageUrl || '',  // Убедимся, что картинка есть
      };
    
      handleAddToCart(additionalProduct);  // Добавляем дополнительный товар (доп) в корзину
      setShowAdditionalItemPopUp(false);  // Закрываем попап после добавления допа
    };


    // Обработчик клика на товар
    const handleItemClick = (item, index) => {
      setSelectedItem(item);
      setSelectedItemIndex(index);

      const targetProducts = [
        "Айс латте карамель-груша",
        "Латте со сгущёнкой и белым шоколадом ",
        "Матча кокос цитрус",
        "Латте лимонная карамель",
        "Какао черника",
        "Американо Маленький",
        "Капучино маленький",
        "Матча латте",
        "Какао классический",
        "Капучино большой",
        "Flat white",
        "Раф кофе",
        "Латте",
        "Пикколо ",
        "Лимонад Река асс",
        "Вода Petroglyph",
        "Латте лимонная карамель ",
        "Какао черника",
      ];

      // const targetProducts1 = [
      //   "Паста с томатами конкассе с соусом путтанеска",
      //   "Гречетто с телячьей щечкой",
      //   "Гречетто с индейкой",
      //   "Паста сливочно-грибная с индейкой и трюфельным маслом",
      //   "Индейка с диким рисом",
      // ];

      if (targetProducts.includes(item.name)) {
        const additionalDrinksCategory = data.find(category => category.name === 'Альтернативное молоко');
        
          setAdditionalItems(item.itemSizes[0].itemModifierGroups[0].items);
          setCurrentCategory('Альтернативное молоко');
          setShowPopUp(true);
          return; // Останавливаем дальнейшее выполнение
        
      }

      // if (targetProducts1.includes(item.name)) {
      //   const additionalDishesCategory = data.find(category => category.name === 'Допы в блюда');
        


      //     handleAddToCart(item);  // Добавляем основное блюдо в корзину
      //     setAdditionalItems(additionalDishesCategory.items);
      //     setCurrentCategory('Допы в блюда');
      //     setShowAdditionalItemPopUp(true);
      //     return; // Останавливаем дальнейшее выполнение
        
      // }

      // Если товар не требует модификаторов, добавляем его напрямую в корзину
      handleAddToCart(item);
    };

    const handleClosePopUp = () => {
      setShowPopUp(false);
      setShowAdditionalPopUp(false);
      setShowAdditionalItemPopUp(false);
      setSelectedItem(null);
    };


    // const handleSkipPopUp = () => {
    //   // Если открыт первый попап и есть второй модификатор, открываем второй попап
    //   if (showPopUp && selectedItem?.itemSizes?.[0]?.itemModifierGroups?.[1]?.items?.length > 0) {
    //     setShowPopUp(false); // Закрываем первый попап
    //     setShowAdditionalPopUp(true); // Открываем второй попап
    //     setAdditionalItems(selectedItem.itemSizes[0].itemModifierGroups[1].items); // Загружаем допы для второго попапа
    //   } else {
    //     // Если уже открыт второй попап или нет второго набора модификаторов, закрываем все попапы
    //     setShowPopUp(false);
    //     setShowAdditionalPopUp(false);
    //     setShowAdditionalItemPopUp(false);
    //     setSelectedItem(null); // Очищаем выбранный товар
    //   }
    // };
    const handleSkipPopUp = () => {
      // Если открыт первый попап и есть второй модификатор, открываем второй попап
      if (showPopUp && selectedItem?.itemSizes?.[0]?.itemModifierGroups?.[1]?.items?.length > 0) {
        setShowPopUp(false); // Закрываем первый попап
        setShowAdditionalPopUp(true); // Открываем второй попап
        setAdditionalItems(selectedItem.itemSizes[0].itemModifierGroups[1].items); // Загружаем допы для второго попапа
      } else {
        // Если второго набора нет или был пропущен второй попап, добавляем товар с учётом только выбранного модификатора (если он был)
        const itemToAdd = {
          ...selectedItem,
          modifiers: [firstModifier, secondModifier].filter(Boolean), // Добавляем только выбранные модификаторы
        };
        handleAddToCart(itemToAdd); // Добавляем товар в корзину
    
        // Закрываем все попапы и очищаем состояние
        setShowPopUp(false);
        setShowAdditionalPopUp(false);
        setShowAdditionalItemPopUp(false);
        setSelectedItem(null); // Очищаем выбранный товар
      }
    };
    
    return (
      <div>
        {/* Заголовок категории */}
        <div 
          className="category-header p-4 mb-4 border-2 rounded-lg cursor-pointer flex justify-between items-center" 
          style={{ borderColor: '#6E742F', borderRadius: '12px' }} 
          onClick={toggleOpen}
        >
          <Heading 
            size="headingxs" 
            as="h2" 
            className="mb-2 text-left lg:text-[18px] font-bold"
          >
            {category.name} 
          </Heading>
          <Img 
            src={isOpen ? 'images/arrowUp.svg' : 'images/arrowDown.svg'} 
            alt={isOpen ? 'Collapse' : 'Expand'} 
            className="h-[40px] w-[40px]"
          />
        </div>

        {/* Список товаров категории */}
        <div 
          className="category-items overflow-hidden no-scrollbar" 
          style={{ maxHeight: isOpen ? 'none' : '0', transition: 'max-height 0.3s ease-in-out' }}
        >
          {category.items.map((item, index) => {
            const imageUrl = item.itemSizes[0]?.buttonImageUrl || "path/to/default_image.png";
            const { fats, proteins, carbs, energy } = item.itemSizes[0].nutritionPerHundredGrams || {};
            const weight = item.itemSizes[0]?.portionWeightGrams;

            return (
              <div key={index} className="category-item p-2 flex flex-col justify-between mb-4" style={{background: '#3F451C', width: '230px', height:'auto', borderRadius: '20px', margin: '10px auto'}}>
                <div className="flex-grow flex items-center justify-center">
                  <Img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="h-[180px] w-[180px] object-cover mb-4 mt-4"
                    style={{borderRadius: '10px'}} 
                  />
                </div>
                <Heading 
                  size="headingxs" 
                  as="h2" 
                  className="mb-2 text-left lg:text-[14px] font-bold"
                  style={{display: 'flex', marginLeft: '20px'}}
                >
                  {item.name}
                </Heading>
                
                {/* Кнопка для раскрытия описания */}
                <div className="flex items-center justify-between w-full px-2 py-2 cursor-pointer" onClick={toggleDescription}>
                  <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '12px', marginLeft: '10px' }}>Подробнее о товаре</p>
                  <Img 
                    src={isDescriptionOpen ? 'images/arrowUp.svg' : 'images/arrowDown.svg'} 
                    alt={isDescriptionOpen ? 'Collapse' : 'Expand'} 
                    className="h-[20px] w-[20px]"
                  />
                </div>
                
                {/* Описание продукта */}
                <div className="product-description overflow-hidden px-2" style={{ maxHeight: isDescriptionOpen ? '200px' : '0', transition: 'max-height 0.3s ease-in-out', overflow: 'auto' }}>
                  <p style={{ color: '#fff', fontSize: '10px', marginLeft: '10px' }}>{item.description}</p>
                  {weight && (
                    <p style={{ color: '#fff', fontSize: '10px', marginLeft: '10px' }}>
                      Вес порции: {weight} г
                    </p>
                  )}
                  {(fats || proteins || carbs || energy) && (
                    <p style={{ color: '#fff', fontSize: '10px', marginLeft: '10px' }}>
                      КБЖУ на 100г: Жиры - {fats || 'N/A'}г, Белки - {proteins || 'N/A'}г, Углеводы - {carbs || 'N/A'}г, Калории - {energy || 'N/A'} ккал
                    </p>
                  )}
                </div>

                {/* Кнопка добавления в корзину и отображение цены */}
                <div className="flex items-center justify-between w-full mt-4 mb-2">
                  <Button 
                    className="bg-[#CEE2B7] text-black rounded-full lg:text-[12px] px-2 py-2 w-[150px] button-hover-animation" 
                    style={{ backgroundColor: '#CEE2B7', color: 'black', fontWeight: 'bold', zIndex: '3', marginLeft: '20px' }}
                    onClick={() => handleItemClick(item, index)}
                  >
                    В КОРЗИНУ
                  </Button>
                  <Heading 
                    size="headingxs" 
                    as="h3" 
                    className="ml-10 w-[110px] lg:text-[18px]"
                  >
                    {`${item.itemSizes[0].prices[0].price} ₽` || "999р"}
                  </Heading>
                </div>
              </div>
            );
          })}
        </div>

        {/* Попап для выбора модификаторов */}
        {showPopUp && (
          <PopUp onClose={handleClosePopUp} onSkip={handleSkipPopUp}>
            <div className="popup-content">
              {additionalItems.map((additionalItem, index) => (
                <div key={index} className="additional-item flex items-center justify-between mb-4">
                  <Heading className="max-w-[200px] break-words" size="headingxs" as="h3">
                    {additionalItem.name}
                  </Heading>
                  <Heading 
                    size="headingxs" 
                    as="h3" 
                    className="ml-10 w-[110px] lg:text-[18px]"
                    style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {additionalItem.itemSizes?.[0]?.prices?.[0]?.price || additionalItem.prices?.[0]?.price || "0р"}
                  </Heading>

                  {addedItems[additionalItem.name] ? (
                    <Button className="bg-green-500 text-white rounded-full lg:text-[12px] px-2 py-2 button-hover-animation" disabled>
                      ✔
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleAddItemWithFirstModifier(additionalItem)}
                      className="rounded-full bg-[#CEE2B7] text-black px-2 py-2"
                    >
                      Добавить
                    </Button>
                  )}
                </div>
              ))}

            </div>
          </PopUp>
        )}
              {/* Второй попап для дополнительных модификаторов */}
              {showAdditionalPopUp && (
          <PopUp onClose={handleClosePopUp} onSkip={handleSkipPopUp}>
            <div className="popup-content">
              {additionalItems.map((additionalItem, index) => (
                <div key={index} className="additional-item flex items-center justify-between mb-4">
                  <Heading className="max-w-[200px] break-words" size="headingxs" as="h3">
                    {additionalItem.name}
                  </Heading>
                  <Heading 
                    size="headingxs" 
                    as="h3" 
                    className="ml-10 w-[110px] lg:text-[18px]"
                    style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {additionalItem.itemSizes?.[0]?.prices?.[0]?.price || additionalItem.prices?.[0]?.price || "0р"}
                  </Heading>

                  {addedItems[additionalItem.name] ? (
                    <Button className="bg-green-500 text-white rounded-full lg:text-[12px] px-2 py-2 button-hover-animation" disabled>
                      ✔
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleAddItemWithSecondModifier(additionalItem)}
                      className="rounded-full bg-[#CEE2B7] text-black px-2 py-2"
                    >
                      Добавить
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </PopUp>
        )}
                      {/* Второй попап для дополнительных модификаторов */}
                      {showAdditionalItemPopUp && (
          <PopUp onClose={handleClosePopUp} onSkip={handleSkipPopUp}>
            <div className="popup-content">
              {additionalItems.map((additionalItem, index) => (
                <div key={index} className="additional-item flex items-center justify-between mb-4">
                  <Heading className="max-w-[200px] break-words" size="headingxs" as="h3">
                    {additionalItem.name}
                  </Heading>
                  <Heading 
                    size="headingxs" 
                    as="h3" 
                    className="ml-10 w-[110px] lg:text-[18px]"
                    style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {additionalItem.itemSizes?.[0]?.prices?.[0]?.price || additionalItem.prices?.[0]?.price || "0р"}
                  </Heading>

                  {addedItems[additionalItem.name] ? (
                    <Button className="bg-green-500 text-white rounded-full lg:text-[12px] px-2 py-2 button-hover-animation" disabled>
                      ✔
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleAddAdditionalItemAsProduct (additionalItem)}
                      className="rounded-full bg-[#CEE2B7] text-black px-2 py-2"
                    >
                      Добавить
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </PopUp>
        )}
      </div>
    );
  };

  export default CategoryItem;
