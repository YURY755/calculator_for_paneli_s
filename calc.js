function checkForm() {
    /* ГАБАРИТЫ ЗДАНИЯ */
    const building_length = Number(document.getElementById('building_length').value); // длина здания
    const building_width = Number(document.getElementById('building_width').value); // ширина здания
    const square_area = building_length * building_width; // площадь здания
    const building_perimeter = (building_length * 2) + (building_width * 2); // периметр здания

    /* ОПРЕДЕЛЕНИЕ МАКСИМАЛЬНОЙ ДЛИНЫ СТОРОНЫ И ВЫСОТЫ, РАЗМЕРА КОНЬКА */
    const sides = [building_length, building_width]; // массив с длиной и шириной здания
    const min_side = Math.min.apply(0, sides); // Метод определения минимальной стороны здания в массиве
    const max_side = Math.max.apply(0, sides); // Метод определения максимальной стороны здания в массиве
    const building_height = document.getElementById('building_height').value; // высота здания
    const building_ridge_height = document.getElementById('building_ridge_height').value; // высота здания в коньке
    const heights = [building_height, building_ridge_height]; // массив, с высотой здания и высотой здания в коньке
    const min_height = Math.min.apply(0, heights); // Метод определения минимальной стороны здания в массиве
    const max_height = Math.max.apply(0, heights); // Метод определения максимальной стороны здания в массиве
    const height_difference = max_height - min_height; // разница между высотой в коньке и высотой

    /* ПОЛУЧЕНИЕ ДАННЫХ ИЗ ФОРМЫ ПО ТИПУ КРОВЛИ (КАКАЯ RADIO BUTTON ВЫБРАНА) */
    document.querySelectorAll('input[name="roof_type"]').forEach(radio => {
        if (radio.checked) {
            roof_type_value = radio.value;
        }
    });

    /* ПОЛУЧЕНИЕ ДАННЫХ ИЗ ФОРМЫ ПО ТИПУ МОНТАЖА (КАКАЯ RADIO BUTTON ВЫБРАНА) */
    let mounting_type_value = 0;
    const mounting_type = document.querySelectorAll('input[name="mounting_type"]').forEach(radio => {
        if (radio.checked) {
            mounting_type_value = radio.value;
        }
    });

    /* МОНОЛИТНЫЙ ФУНДАМЕНТ ЗДАНИЯ */
    const monolithic_foundation_blind_area = 0.5; // отмостка от монолитного фундамента 50см
    const monolithic_foundation_blind_area_in_sm = monolithic_foundation_blind_area * 100;
    const monolithic_foundation_blind_area_square = ((building_length + (monolithic_foundation_blind_area + monolithic_foundation_blind_area)) * 2) * monolithic_foundation_blind_area + monolithic_foundation_blind_area * building_width * 2; // расчёт площади отмостки. ((длина здания + 0,5 + 0,5) * две стороны) + ширина здания * две стороны * 0,5
    const monolithic_foundation_square = square_area + monolithic_foundation_blind_area_square; // площадь монолитного фундамента  
    /* Цикл получает значение какая толщина выбрана в radio button */
    let monolithic_foundation_height_value = 0;
    const monolithic_foundation_height = document.querySelectorAll('input[name="monolithic_foundation"]').forEach(radio => {
        if (radio.checked) {
            monolithic_foundation_height_value = radio.value;
        }
    });
    const clean_monolithic_foundation_cubic_capacity = (monolithic_foundation_height_value / 1000) * monolithic_foundation_square; // Рассчитываем чистую кубатуру выбранного бетона
    const monolithic_foundation_cubic_capacity = ((clean_monolithic_foundation_cubic_capacity * 0.15) + clean_monolithic_foundation_cubic_capacity).toFixed(2); // Добавляем 15% на усадку и получаем реальную кубатуру беттона

    /* ЛЕНТОЧНЫЙ ФУНДАМЕНТ ЗДАНИЯ */
    /* Пару слов об алгоритме расчёта. Мы как бы выдавливаем площадь ленточного фундамента внутрь здания, от заданных пользователем размеров длины и ширины, на ширину ленточного фундамента, указываемую в переменной strip_foundation_block_width.
    Далее мы считаем более корректный периметр, который считается по осям четырёх углов (ось - центральная точка квадратика 1200*1200).
    Затем считаем площадь получившихся линий и складываем с общим периметром  */
    let strip_foundation_lines_count = 0;
    min_side >= 18 ? strip_foundation_lines_count = Math.ceil(min_side / 10) + 1 : strip_foundation_lines_count = 2; // условие, считаем количество рядов ленточного фундамента. Если здание больше 18м, использование ферм заменяется дополнительным рядом колонн, под который и рассчитан фундамент.
    const strip_foundation_block_width = 600; // ширина ленточного фундамента в мм. Задаётся проектировщиком из расчёта нагрузки
    const strip_foundation_depth = 400; // глубина заложения ленточного фундамента в мм.
    const strip_foundation_lenth = max_side - (strip_foundation_block_width / 1000); // определяем длину нового периметра ленточного фундамента по осям
    const strip_foundation_width = min_side - (strip_foundation_block_width / 1000); // то же самое, только определяем ширину
    const strip_foundation_perimeter = (strip_foundation_lenth * 2) + (strip_foundation_width * 2); // считаем новый периметр уже не здания, а ленточного фундамента
    const strip_foundation_perimeter_square = strip_foundation_perimeter * (strip_foundation_block_width / 1000); // считаем площадь, получившегося периметра
    const strip_foundation_lines_length = min_side - (strip_foundation_block_width * 2 / 1000); // рассчитываем корректную длину дополнительных линий фундамента, если они есть
    const strip_foundation_lines_square = (strip_foundation_lines_count - 1) * strip_foundation_lines_length * (strip_foundation_block_width / 1000); // вычитаем одну линию из общего числа, чтобы было корректно и считаем площадь дополнительных линий ленточного фундамента
    const strip_foundation_square = (strip_foundation_perimeter_square + strip_foundation_lines_square).toFixed(2); // складываем площадь периметра и площадь линиий и получаем площадь ленточного фундамента
    const clean_strip_foundation_cubic_capacity = strip_foundation_square * (strip_foundation_depth / 1000);
    const strip_foundation_cubic_capacity = ((clean_strip_foundation_cubic_capacity * 0.15) + clean_strip_foundation_cubic_capacity).toFixed(2);

    /* СТОЛБЧАТЫЙ ФУНДАМЕНТ ЗДАНИЯ */
    let columnar_foundation_perimeter_column_count = Math.ceil(building_perimeter / 6); // считаем количество столбов по периметру
    columnar_foundation_perimeter_column_count % 2 == 0 ? true : columnar_foundation_perimeter_column_count += 1; // проверяем чётное или нечётное получилось значение, если нечётное добавляем 1. количество столбов у прямоугольного здания по периметру не может быть нечётным, должно быть симметричным чётным.
    const columnar_foundation_line_of_column_count = (Math.ceil(min_side / 6) - 2) <= 0 ? 0 : Math.ceil(min_side / 6) - 2; // простая проверка на количество дополнительных линий для столбов на отрицательное значение. У слишком маленького здания их просто 0, а не отрицательное значенние.
    const columnar_foundation_column_count_inside_the_building = (Math.ceil(max_side / 6) - 1)  * (Math.ceil(min_side / 6) - 1); // количество столбов внутри здания, за исключением периметра
    const columnar_foundation_column_count = columnar_foundation_perimeter_column_count + columnar_foundation_column_count_inside_the_building; // количество столбов всего
    
    const columnar_foundation_depth = 1.5; // Глубина заложения столбчатого фундамента в м
    const columnar_foundation_square_of_one_column = 1.2 * 1.2; // Площадь одного столба в м.кв.
    const columnar_foundation_cubic_capacity_of_one_column = columnar_foundation_depth * columnar_foundation_square_of_one_column; // кубатура одного столба
    const clean_columnar_foundation_cubic_capacity = columnar_foundation_column_count * columnar_foundation_cubic_capacity_of_one_column; // чистая кубатура всех столбов
    const columnar_foundation_cubic_capacity = ((clean_columnar_foundation_cubic_capacity * 0.15) + clean_columnar_foundation_cubic_capacity).toFixed(2); // реальная кубатура всех столбов с коэффициентами усадки
    const columnar_foundation_square_of_all_columns = (columnar_foundation_column_count * columnar_foundation_square_of_one_column).toFixed(2); // площадь всех столбов столбчатого фундамента

    /* МЕТАЛЛОЁМКОСТЬ ЗДАНИЯ */
    const metal_consumption_one_story_building = 50;
    const metal_consumption_two_story_building = 80;
    const metal_frame_one_story_building = (square_area * metal_consumption_one_story_building) / 1000; // металлокаркас одноэтажного строения в тоннах
    const metal_frame_two_story_building = square_area * metal_consumption_two_story_building / 1000; // металлокаркас двухэтажного строения в тоннах

    /* ПЛОЩАДЬ СТЕН ДЛЯ ВСЕХ КРОВЕЛЬ БЕЗ ФРОНТОНОВ */
    const walls_square_without_gable_area = (min_side * min_height * 2) + (max_side * min_height * 2); // площадь всех стен, без фронтонов

    /* ОПРЕДЕЛЕНИЕ СКАТА КРОВЛИ */
    /* Скат кровли разный для двускатной и односкатной кровли. Для односкатной кровли скат идёт  во все стороны одинаковый. Для двускатной кровли скат идёт только вниз и по торцам, но не вверх! */
    const gable_roof_slope = 0.3; // скат двускатной кровли
    const shed_roof_slope = 0.6; // скат односкатной кровли
    const roof_slope_at_the_ends = 0.6; // скат кровли 60см в метрах по торцам здания обеих кровель
    const max_side_with_slope = max_side + roof_slope_at_the_ends; // добавили скат кровли к длине здания. Этот скат по длине одинаковый для обеих видов кровли
    const min_side_with_slope = min_side + roof_slope_at_the_ends; // добавили скат кровли к минимальной стороне здания (ширине). 
    
    /* ПЛОЩАДЬ СТЕН ДЛЯ ДВУСКАТНОЙ КРОВЛИ С ФРОНТОНАМИ */
    const gable_hypotenus = Math.sqrt(Math.pow((min_side / 2), 2) + Math.pow(height_difference, 2)); // гипотенуза двускатной кровли с коньком по центру. квадрат гипотенузы равен сумме квадратов катетов
    const gable_hypotenus_and_slope = gable_hypotenus + gable_roof_slope; // гипотенуза двускатной кровли с учётом ската 30см
    const gable_area = (min_side / 2) * height_difference * 2; // площадь фронтонов двускатной кровли. 1/2 основания треугольника * высоту h. На две стороны домножаем на 2.
    const gable_walls_square = walls_square_without_gable_area + gable_area; // площадь стен, с учётом фронтонов двускатной кровли

    /* ПЛОЩАДЬ СТЕН ДЛЯ ОДНОСКАТНОЙ КРОВЛИ С ФРОНТОНАМИ */
    const shed_hypotenus = Math.sqrt(Math.pow(min_side, 2) + Math.pow(height_difference, 2)); // гипотенуза односкатной кровли с коньком по центру. квадрат гипотенузы равен сумме квадратов катетов
    const shed_hypotenus_and_slope = shed_hypotenus + shed_roof_slope; // гипотенуза односкатной кровли с учётом ската 30см 
    const shed_area = min_side * 0.5 * height_difference * 2; // площадь фронтонов односкатной кровли. 1/2 основания треугольника * высоту h. На две стороны домножаем на 2.
    const shed_walls_square = walls_square_without_gable_area + shed_area; // площадь стен, с учётом фронтонов односкатной кровли
    
    /* ПЛОЩАДЬ ДВУСКАТНОЙ КРОВЛИ */
    const gable_roof_square = (gable_hypotenus_and_slope * max_side_with_slope * 2).toFixed(2); // площадь двускатной кровли с учётом ската, с округлением до 2 знаков
    
    /* ПЛОЩАДЬ ОДНОСКАТНОЙ КРОВЛИ */
    const shed_roof_square = (shed_hypotenus_and_slope * max_side_with_slope).toFixed(2); // площадь односкатной кровли с учётом ската, с округлением до 2 знаков

    /* УГОЛ НАКЛОНА ДВУСКАТНОЙ КРОВЛИ */
    /* Формула расчёта наклона кровли в тангенсах = a2 / 2S. 
    Или квадрат длины конька делённый на двойную площадь половины фронтона. 
    И переводим в градусы, домножив на 180 и разделив на число ПИ */
    const tangent_alfa_for_gable_roof = Math.pow(height_difference, 2) / ((min_side / 2) * height_difference * 2) * 2;
    // Здесь мы считаем тангенс угла альфа равнобедренного треугольника по формлуе alfa = a2/2S
    const arctangent_alfa_for_gable_roof = Math.PI + Math.atan(tangent_alfa_for_gable_roof); // Здесь я слабо понимаю что происходит, с точки зрения тригонометрии, но оно почему то работает. Мы число ПИ добавляем к арктангесу от тангенса.
    const gable_roof_slope_in_degrees = (180 - (360 - (arctangent_alfa_for_gable_roof * 180 / Math.PI))).toFixed(0); // здесь мы переводим угол альфа из радиан в градусы по формуле * 180 / число ПИ. Мне было важно, чтобы угол наклона кровли не мог быть больше 90° (иначе как она завернулась бы на второй круг? :-)), поэтому я методом тыка подобрал 180 минус (360 минус то, что получилось до этого). И это всё работает правильно, как нужно. Наверное с точки зрения математики и тригонометрии, этому есть адекватное объяснение, но в школе по тригонометрии у меня была тройка.

    /* УГОЛ НАКЛОНА ОДНОСКАТНОЙ КРОВЛИ */
    /* Вся разница от двускатной кровли в том, что значения тангенса получается в два раза меньше, остальной принцип такой же */ 
    const tangent_alfa_for_shed_roof = Math.pow(height_difference, 2) / ((min_side / 2) * height_difference * 2); // вот тут значение тангенса в 2 раза меньше (мы не домножаем на 2, как в двускатной кровле)
    const arctangent_alfa_for_shed_roof = Math.PI + Math.atan(tangent_alfa_for_shed_roof);
    const shed_roof_slope_in_degrees = (180 - (360 - (arctangent_alfa_for_shed_roof * 180 / Math.PI))).toFixed(0);

    /* ФАСОННЫЕ ЭЛЕМЕНТЫ */
    const stock_for_shaped_elements_fixed = 0.1; // запас фасонных элементов 10% на нахлёст и не только
    
    /* СРЕДНЯЯ РАЗВЁРТКА ФАСОННЫХ ЭЛЕМЕНТОВ, В ММ */
    const corner_post_scan = 500; // развёртка угловых стоек
    const outer_ridge_scan = 630; // развёртка внешнего конька
    const inner_ridge_scan = 180; // развёртка внутреннего конька
    const roof_ends_at_the_beginning_scan = 370; // развёртка торцов кровельной панели сначала односкатной кровли
    const roof_ends_at_the_end_scan = 185; // развёртка торцов кровельной панели на концах
    const roof_ends_at_90_degrees_scan = 380; // развёртка торцов кровельной панели по бокам под 90°
    const joints_of_walls_and_roof_scan = 160; // развёртка фасонного элемента примыкания стеновых панелей к кровельным
    const plinth_scan = 450; // развёртка цоколя
    const inner_plinth_scan = 250; // развёртка внутреннего цоколя
    const cover_strip_scan = 180; // развёртка нащельников

    /* УГЛОВЫЕ СТОЙКИ, КОНЁК ВНЕШНИЙ И ВНУТРЕННИЙ, СТЫКИ СТЕН И КРОВЛИ, ЦОКОЛЬ ВНЕШНИЙ И ВНУТРЕННИЙ */
    const shaped_element_corner_post = Math.ceil((building_height * 4 * stock_for_shaped_elements_fixed) + (building_height * 4)); // Угловые стойки с запасом, м.пог.
    const shaped_element_outer_ridge = Math.ceil((max_side * stock_for_shaped_elements_fixed) + max_side); // конёк внешний м.пог. с запасом
    const shaped_element_inner_ridge = Math.ceil((max_side * stock_for_shaped_elements_fixed) + max_side); // конёк внутренний м.пог. с запасом
    const shaped_element_joints_of_walls_and_roof = Math.ceil((building_perimeter * stock_for_shaped_elements_fixed) + building_perimeter); // стыки стен и кровли с запасом
    const shaped_element_plinth = Math.ceil((building_perimeter * stock_for_shaped_elements_fixed) + building_perimeter); // Фасонный элемент внешний цоколь с запасом
    const shaped_element_inner_plinth = Math.ceil((building_perimeter * stock_for_shaped_elements_fixed) + building_perimeter); // Фасоннный элемент внутренний цоколь с запасом

    /* Площади коньков */ 
    const outer_ridge_square = ((outer_ridge_scan / 1000) * shaped_element_outer_ridge).toFixed(2); // площадь внешних коньков
    const inner_ridge_square = ((inner_ridge_scan / 1000) * shaped_element_inner_ridge).toFixed(2); // площадь внутренних коньков
    
    /* ТОРЦЫ КРОВЛИ */
    /* для односкатной кровли */
    const shaped_element_roof_ends_at_the_beginning_for_shed_roof = Math.ceil((max_side_with_slope * stock_for_shaped_elements_fixed) + max_side_with_slope); // начало кровли
    const shaped_element_roof_ends_at_the_end_for_shed_roof = Math.ceil((max_side_with_slope * stock_for_shaped_elements_fixed) + max_side_with_slope); // конец кровли
    const shaped_element_roof_ends_at_90_degrees_for_shed_roof = Math.ceil((((min_side_with_slope * stock_for_shaped_elements_fixed) + min_side_with_slope)) * 2); // торцы кровли на обе стороны

    /* Площадь фасонных элементов для односкатной кровли */
    const roof_ends_at_the_beginning_for_shed_roof_square = (shaped_element_roof_ends_at_the_beginning_for_shed_roof * (roof_ends_at_the_beginning_scan / 1000)).toFixed(2);
    const roof_ends_at_the_end_for_shed_roof_square = (shaped_element_roof_ends_at_the_end_for_shed_roof * (roof_ends_at_the_end_scan / 1000)).toFixed(2);
    const roof_ends_at_90_degrees_for_shed_roof_square = (shaped_element_roof_ends_at_90_degrees_for_shed_roof * (roof_ends_at_90_degrees_scan / 1000)).toFixed(2);
    /* Сумма фасонных элементов для односкатной кровли */
    const summary_shaped_elements_for_shed_roof_in_running_meters = shaped_element_roof_ends_at_the_beginning_for_shed_roof + shaped_element_roof_ends_at_the_end_for_shed_roof + shaped_element_roof_ends_at_90_degrees_for_shed_roof; // в погонных метрах
    const summary_shaped_elements_for_shed_roof_in_square_meters = (Number(roof_ends_at_the_beginning_for_shed_roof_square) + Number(roof_ends_at_the_end_for_shed_roof_square) + Number(roof_ends_at_90_degrees_for_shed_roof_square)).toFixed(2); // в квадратных метрах

    /* для двускатной кровли */
    const shaped_element_roof_ends_at_the_end_for_gable_roof = (Math.ceil((max_side_with_slope * stock_for_shaped_elements_fixed) + max_side_with_slope)) * 2; // конец кровли для двух сторон
    const shaped_element_roof_ends_at_90_degrees_for_gable_roof = (Math.ceil((min_side_with_slope * stock_for_shaped_elements_fixed) + min_side_with_slope)) * 2; // торцы кровли
    /* Площадь фасонных элементов для двускатной кровли */
    const roof_ends_at_the_end_for_gable_roof_square = (shaped_element_roof_ends_at_the_end_for_gable_roof * (roof_ends_at_the_end_scan / 1000)).toFixed(2);
    const roof_ends_at_90_degrees_for_gable_roof_square = (shaped_element_roof_ends_at_90_degrees_for_gable_roof * (roof_ends_at_90_degrees_scan / 1000)).toFixed(2);
    /* Сумма фасонных элементов для двускатной кровли */
    const summary_shaped_elements_for_gable_roof_in_running_meters = shaped_element_roof_ends_at_the_end_for_gable_roof + shaped_element_roof_ends_at_90_degrees_for_gable_roof; // в погонных метрах
    const summary_shaped_elements_for_gable_roof_in_square_meters = (Number(roof_ends_at_the_end_for_gable_roof_square) + Number(roof_ends_at_90_degrees_for_gable_roof_square)).toFixed(2); // в квадратных метрах

    /* для плоской кровли */
    const summary_shaped_elements_for_flat_roof_in_running_meters = summary_shaped_elements_for_shed_roof_in_running_meters;
    const summary_shaped_elements_for_flat_roof_in_square_meters = summary_shaped_elements_for_flat_roof_in_running_meters * (roof_ends_at_90_degrees_scan / 1000);

    /* Условием ниже подставляем выбранный пользователем тип кровли под результат вычислений. Также ниже в условии начало кровли применяется только к односкатной кровле. И применяются переменные с текстом и строкой и выводятся в конце текстового результата.  */
    let roof_ends_at_the_beginning_res_in_running_meters = 0;
    let roof_ends_at_the_end_res_in_running_meters = 0;
    let roof_ends_at_90_degrees_res_in_running_meters = 0;
    let roof_ends_at_the_beginning_res_in_square_meters = 0;
    let roof_ends_at_the_end_res_in_square_meters = 0;
    let roof_ends_at_90_degrees_res_in_square_meters = 0;
    let summary_shaped_elements_for_roof_in_running_meters = 0;
    let summary_shaped_elements_for_roof_in_square_meters = 0;
    let shaped_element_outer_ridge_for_shed_roof = 0;

    if (roof_type_value === 'Односкатная кровля') {
        summary_shaped_elements_for_roof_in_running_meters = summary_shaped_elements_for_shed_roof_in_running_meters; // всего фасонных в погонных метрах
        summary_shaped_elements_for_roof_in_square_meters = summary_shaped_elements_for_shed_roof_in_square_meters; // всего фасонных в квадратных метрах
        shaped_element_outer_ridge_for_shed_roof = 'Внешний конёк: не используются';
        shaped_element_inner_ridge_for_shed_roof = 'Внутренний конёк: не используются';
        shaped_element_outer_ridge_for_shed_roof_in_square_meters = '';
        shaped_element_inner_ridge_for_shed_roof_in_square_meters = '';

        roof_ends_at_the_beginning_res_in_running_meters = `Торцы кровли для начала кровли: ${shaped_element_roof_ends_at_the_beginning_for_shed_roof}м. пог. или `; // начало кровли в погонных
        roof_ends_at_the_end_res_in_running_meters = `Торцы кровли для конца кровли: ${shaped_element_roof_ends_at_the_end_for_shed_roof}м.пог. или `; // конец кровли в погонных
        roof_ends_at_90_degrees_res_in_running_meters = shaped_element_roof_ends_at_90_degrees_for_shed_roof; // торцы кровли под 90° (бока) в погонных
        roof_ends_at_the_beginning_res_in_square_meters = `${roof_ends_at_the_beginning_for_shed_roof_square}м. кв.`; // начало кровли в квадратных
        roof_ends_at_the_end_res_in_square_meters = `${roof_ends_at_the_end_for_shed_roof_square}м. кв.`; // конец кровли в квадратных
        roof_ends_at_90_degrees_res_in_square_meters = roof_ends_at_90_degrees_for_shed_roof_square; // торцы кровли под 90° (бока) в квадратных
    }
    else if (roof_type_value === 'Двускатная кровля') {
        summary_shaped_elements_for_roof_in_running_meters = summary_shaped_elements_for_gable_roof_in_running_meters;
        summary_shaped_elements_for_roof_in_square_meters = summary_shaped_elements_for_gable_roof_in_square_meters;

        shaped_element_outer_ridge_for_shed_roof = `Внешнний конёк: ${shaped_element_outer_ridge}м. пог. или `; // внешний конёк в погонных метрах
        shaped_element_inner_ridge_for_shed_roof = `Внутренний конёк: ${shaped_element_inner_ridge}м. пог. или `; // внутренний конёк в погонных метрах
        shaped_element_outer_ridge_for_shed_roof_in_square_meters = `${outer_ridge_square}м. кв.`;
        shaped_element_inner_ridge_for_shed_roof_in_square_meters = `${inner_ridge_square}м. кв.`;

        roof_ends_at_the_beginning_res_in_running_meters = `Торцы кровли для начала кровли: не используются`;
        roof_ends_at_the_end_res_in_running_meters = `Торцы кровли для конца кровли: ${shaped_element_roof_ends_at_the_end_for_gable_roof}м. пог. или `;
        roof_ends_at_90_degrees_res_in_running_meters = shaped_element_roof_ends_at_90_degrees_for_gable_roof;
        roof_ends_at_the_beginning_res_in_square_meters = '';
        roof_ends_at_the_end_res_in_square_meters = `${roof_ends_at_the_end_for_gable_roof_square}м. кв.`;
        roof_ends_at_90_degrees_res_in_square_meters = roof_ends_at_90_degrees_for_gable_roof_square;
    }
    else if (roof_type_value === 'Плоская кровля')
    {
        summary_shaped_elements_for_roof_in_running_meters = summary_shaped_elements_for_flat_roof_in_running_meters;
        summary_shaped_elements_for_roof_in_square_meters = summary_shaped_elements_for_flat_roof_in_square_meters;

        shaped_element_outer_ridge_for_shed_roof = 'Внешний конёк: не используются';
        shaped_element_inner_ridge_for_shed_roof = 'Внутренний конёк: не используются';
        shaped_element_outer_ridge_for_shed_roof_in_square_meters = '';
        shaped_element_inner_ridge_for_shed_roof_in_square_meters = '';
        
        roof_ends_at_the_beginning_res_in_running_meters = `Торцы кровли для начала кровли: не используются`;
        roof_ends_at_the_end_res_in_running_meters = `Торцы кровли для конца кровли: не используются`;
        roof_ends_at_90_degrees_res_in_running_meters = summary_shaped_elements_for_flat_roof_in_running_meters;
        roof_ends_at_the_beginning_res_in_square_meters = '';
        roof_ends_at_the_end_res_in_square_meters = '';
        roof_ends_at_90_degrees_res_in_square_meters = summary_shaped_elements_for_flat_roof_in_square_meters;
        
    }
    else {
        summary_shaped_elements_for_roof_in_running_meters = 0;
        summary_shaped_elements_for_roof_in_square_meters = 0;
    }

    // убрать нащельники если монтаж вертикальный
    // нащельники для односкатной кровли пересчитать и для плоской кровли уменьшить на величину без фронтонов
    // внутренний и внешний конёк недоступным для односкатной кровли
    

    /* НАЩЕЛЬНИКИ */
    /* Линии нащельников */
    const shaped_element_cover_strip_lines_for_max_side = max_side > 6 ? Math.ceil(max_side / 6) - 1 : 0; // количество линий нащельников для длинной стороны. просто проверяем условием чётное или нечётное число при делении на 6 и выдаём результат
    const shaped_element_cover_strip_lines_for_min_side = min_side > 6 ? Math.ceil(min_side / 6) - 1 : 0; // количество линий нащельников для короткой стороны
    const shaped_element_cover_strip_lines = (shaped_element_cover_strip_lines_for_max_side * 2) + (shaped_element_cover_strip_lines_for_min_side * 2); // количество линий всего

    /* Нащельники фронтонов */
    /* Считаем нащельники во фронтонах короткой стороны по формуле поиска стороны b прямоугольной трапеции: b = a - SQRT(d^2 - c^2), где d - отрезок гипотенузы кровли, a - высота конька, с - основание трапеции, и b - малая грань трапеции или же наш фронтон  */
    const length_of_one_segment_of_hypotenus = (gable_hypotenus * 2) / Math.ceil(min_side / 6); // ищем d или отрезок гипотенузы кровли    
    const segment_count = Math.ceil(min_side / 6); // количество отрезков между колоннами или панелями или где пойдут наши нащельники
    const base_of_trapezoid = min_side / segment_count; // считаем основание трапеции или отрезок между колоннами или кусок малой стороны или "с" по нашей формуле
    const sqrt_of_segment_count_and_base_of_trapezoid = Math.sqrt(Math.pow(length_of_one_segment_of_hypotenus, 2) - Math.pow(base_of_trapezoid, 2)); // часть формулы, для расчёта неизвестной стороны трапеции SQRT(d^2 - c^2)
    let height_of_gable = height_difference - sqrt_of_segment_count_and_base_of_trapezoid; // высота следующей линии нащельника фронтона, если отступать от центра(height difference или высота нашего конька)
    height_of_gable < 0 ? height_of_gable = 0 : height_of_gable; // третичным оператором прописываем условие, что высота следующей линии фронтона не может быть меньше нуля
    const the_difference_between_gable_shape_elements = height_difference - height_of_gable; // высота линии фронтона или нащельника, двигаясь от центра к краю уменьшается всегда на фиксированную величину, эту. 
    // Циклом ниже мы идём от центра малой стороны здания и суммируем все линии фронтонов от большей к меньшей, но включая центральную линию!
    let shaped_element_cover_strip_for_one_half_min_side = 0;
    for (let i = height_difference; i > 0; i-=the_difference_between_gable_shape_elements) {
        shaped_element_cover_strip_for_one_half_min_side = shaped_element_cover_strip_for_one_half_min_side + i;
    }
    const shaped_element_cover_strip_for_gable = Math.ceil(((shaped_element_cover_strip_for_one_half_min_side * 2) - height_difference) * 2); // считаем итоговое количество нащельников фронтонов на обе стороны

    /* ИТОГ НАЩЕЛЬНИКИ */
    const shaped_element_cover_strip_for_walls = shaped_element_cover_strip_lines * min_height; // итоговое количество погонных метров нащельников для стен
    let shaped_element_cover_strip = shaped_element_cover_strip_for_gable + shaped_element_cover_strip_for_walls; // итоговое количество нащельников
    mounting_type_value === 'Вертикальный монтаж' ? shaped_element_cover_strip = 0 : false; // обнуляем нащельники, если выбран вертикальный монтаж

    /* ПЛОЩАДЬ КАЖДОГО ТИПА ФАСОННОГО ЭЛЕМЕНТА (ВСЕГО ОБЪЁМА) */
    const corner_post_square = ((corner_post_scan / 1000) * shaped_element_corner_post).toFixed(2); // площадь угловых стоек
    
    const joints_of_walls_and_roof_square    = ((joints_of_walls_and_roof_scan / 1000) * shaped_element_joints_of_walls_and_roof).toFixed(2); // площадь стыков стены и кровли
    const plinth_square = ((plinth_scan / 1000) * shaped_element_plinth).toFixed(2); // площадь цоколя
    const inner_plinth_square = ((inner_plinth_scan / 1000) * shaped_element_inner_plinth).toFixed(2); // площадь внутреннего цоколя
    const shaped_element_cover_strip_square = ((cover_strip_scan / 1000) * shaped_element_cover_strip).toFixed(2);
    
    /* СУММА ВСЕХ ФАСОННЫХ  ЭЛЛЕМЕНТОВ В М.ПОГ. И В М.КВ. */
    const sum_of_shaped_elements_in_running_meters = shaped_element_corner_post + shaped_element_outer_ridge + shaped_element_inner_ridge + shaped_element_joints_of_walls_and_roof + shaped_element_plinth + shaped_element_inner_plinth + shaped_element_cover_strip + summary_shaped_elements_for_roof_in_running_meters; // в погонных метрах
    const sum_of_shaped_elements_in_square_meters = (Number(corner_post_square) + Number(outer_ridge_square) + Number(inner_ridge_square) + Number(joints_of_walls_and_roof_square) + Number(plinth_square) + Number(inner_plinth_square) + Number(shaped_element_cover_strip_square) + Number(summary_shaped_elements_for_roof_in_square_meters)).toFixed(2); // в квадратных метрах

    // Указывать цвет фасонных элементов
    


    /* ВНУТРЕННИЕ ПЕРЕГОРОДКИ */

    /* МЕЖЭТАЖНЫЕ ПЕРЕКРЫТИЯ */

    /* ОКНА, ДВЕРИ, ВОРОТА */

    /* ПОЛЕ ИМЯ, E-MAIL, ТЕЛЕФОН */

    /* СЭНДВИЧ ПАНЕЛИ */

    /* РАЗБИТЬ КОД НА БЛОКИ И РАЗОБРАТЬСЯ С ИМПОРТОМ */ 

    /* 
    Указывать отмостку
    Выбирать утеплитель для сэндвич панелей
    Выбирать толщину сэндвич панелей
    Сделать плоскую кровлю с пометкой для холодильных камер только внутри других помещений
    Учитывать диапазоны цен на сэндвич панели
    Изменять картинку, цвет стен, кровли, ворот
    Предлагать горизонтальный и вертикальный монтаж сэндвич панелей
    Рассчитывать цену
    Расписать, что входит в фундамент и в фасонные элементы в "технических характеристиках здания"
    Возможность влиять на стоимость фундамента через утепление плиты и армирование и кубатуру

    После кнопки "Отправить заявку" заказчику на почту приходят характеристики его здания без цены и пометка что КП будет прислано чуть позже.
    Кнопку ОТПРАВИТЬ информацию меняем на ПОЛУЧИТЬ КП
    */

    // сделать чекбокс на односкатную, двускатную и плоскую кровлю. Если выбрана односкатная или двускатная то должна вылезать ошибка в случае если разница между высотой в коньке и просто высотой = 0.

    /* Длина всегда больше ширины здания. Даже если пользователь в калькуляторе делает ширину > длины, программа принимает бОльшее значение равным длине */
    /* Высота в коньке всегда больше высоты здания по стенам. Даже если пользователь в калькуляторе делает высоту по стенам > высоты в коньке, программа принимает бОльшее значение равным высоте в коньке */

    if (sides[0] <= 0 || sides[1] <= 0 || sides === undefined || sides === null) {
        console.log('Введите корректные значения размеров здания!');
    }

    if (heights[0] <= 0 || heights[1] <= 0 || heights === undefined || heights === null) {
        console.log('Введите корректные значения высоты здания!');
    }
    
    // console.log(`Длина здания: ${max_side}`);
    // console.log(`Ширина здания: ${min_side}`);
    // console.log('Максимальная сторона: ' + max_side);
    // console.log('Минимальная сторона: ' + min_side);
    // console.log(`Площадь здания: ${square_area}`);
    // console.log(`Периметр здания: ${building_perimeter}`);
    // console.log(`Высота здания: ${min_height}`);
    // console.log(`Высота здания в коньке: ${max_height}`);
    // console.log(`Разница между коньком и высотой по стенам: ${height_difference}`);
    // console.log(`Площадь фронтонов: ${gable_area}`);
    // console.log(`Площадь стен без фронтонов: ${walls_square_without_gable_area}`);
    // console.log(`Толщина фундамента: ${monolithic_foundation_height_value}`);
    // console.log(`Чистая кубатура бетона монолитной плиты: ${clean_monolithic_foundation_cubic_capacity}`);
    // console.log(`Реальная кубатура бетона монолитной плиты: ${monolithic_foundation_cubic_capacity}`);
    // console.log(`Чистая кубатура бетона ленточного фундамента плиты: ${clean_strip_foundation_cubic_capacity}`);
    // console.log(`Реальная кубатура бетона ленточного фундамента: ${strip_foundation_cubic_capacity}`);
    
    document.getElementById('square_area').innerHTML = 
    `Технические характеристики здания <br /> 
    Площадь здания: ${square_area} <br />
    Периметр здания: ${building_perimeter} <br />
    Площадь стен: ${gable_walls_square} м.кв. <br />
    Площадь двускатной кровли: ${gable_roof_square} <br />
    Площадь односкатной кровли: ${shed_roof_square} <br />
    Металлокаркас одноэтажного здания: ${metal_frame_one_story_building}т. <br />
    Металлокаркас двухэтажного здания: ${metal_frame_two_story_building}т. <br />
    Угол наклона двускатной кровли: ${gable_roof_slope_in_degrees}°. <br />
    Угол наклона односкатной кровли: ${shed_roof_slope_in_degrees}°. <br />
    Отмостка: ${monolithic_foundation_blind_area_in_sm}см. <br />
    Площадь монолитного фундамента: ${monolithic_foundation_square}м.кв. <br />
    Кубатура монолитного фундамента: ${monolithic_foundation_cubic_capacity}м.куб. <br />
    Площадь ленточного фундамента: ${strip_foundation_square}м.кв. <br />
    Кубатура ленточного фундамента: ${strip_foundation_cubic_capacity}м.куб. <br />
    Площадь столбчатого фундамента: ${columnar_foundation_square_of_all_columns}м.кв. <br />
    Кубатура столбчатого фундамента: ${columnar_foundation_cubic_capacity}м.куб. <br /><br />`;

    document.getElementById('shaped_elements').innerHTML = 
    `Фасонные элементы: <br /> 
     Угловые стойки: ${shaped_element_corner_post}м. пог. или ${corner_post_square}м. кв. <br /> 
     ${shaped_element_outer_ridge_for_shed_roof}${shaped_element_outer_ridge_for_shed_roof_in_square_meters} <br /> 
     ${shaped_element_inner_ridge_for_shed_roof}${shaped_element_inner_ridge_for_shed_roof_in_square_meters} <br /> 
     Стыки стен и кровли: ${shaped_element_joints_of_walls_and_roof}м. пог. или ${joints_of_walls_and_roof_square}м. кв. <br /> 
     Цоколь внешний: ${shaped_element_plinth}м. пог. или ${plinth_square}м. кв. <br /> 
     Цоколь внутренний: ${shaped_element_inner_plinth}м. пог. или ${inner_plinth_square}м. кв. <br /> 
     Нащельник: ${shaped_element_cover_strip}м. пог. или ${shaped_element_cover_strip_square}м. кв. <br /> 
     ${roof_ends_at_the_beginning_res_in_running_meters}${roof_ends_at_the_beginning_res_in_square_meters}<br />
     ${roof_ends_at_the_end_res_in_running_meters}${roof_ends_at_the_end_res_in_square_meters}<br />
     Торцы кровли по бокам под 90° : ${roof_ends_at_90_degrees_res_in_running_meters}м. пог. или ${roof_ends_at_90_degrees_res_in_square_meters}м. кв. <br />
     ВСЕГО: ${sum_of_shaped_elements_in_running_meters}м.пог. или ${sum_of_shaped_elements_in_square_meters}м. кв.
    `;


}

    // баг, торцы кровли под 90 градусов для односката и двуската в квадратах дают сильно разные значения
    // протестить все квадраты получаемые
    // дальше условием если выбрана односкатная кровля то начало считается только для неё, для всех остальных кровель только торцы кровли и концы кровли
    // посчитать правильно количество линий для маленьких зданий <= 6м, для зданий 6-12м и для зданий свыше 12м
    // прикинуть что фронтоны будут на более короткой стороне и учесть их в расчёт для широких зданий
    // считать нащельники только при горизонтальном монтаже
    // Необходимо корректно высчитать на разные здания фасонные элементы фронтонов
    // угловые стойки, конёк внешний и внутренний, торцы кровли, примыкание стен к кровле, нащельники, цоколь двойной


    // if (roof_type_value === 'Односкатная') {

    // }

    //  if (building_length >= building_width) {
    //      console.log('Длина это максимальная сторона ');
    //  }
    //  else console.log('Ширина это максимальная сторона ');

        // 
    // do {
    //     i = i - (i - height_of_gable);
    //     console.log(i);
    // }
    // while (i > 0);

    //  do  {
    //      i = i - Math.sqrt(Math.pow(gable_hypotenus / ((shaped_element_cover_strip_lines_for_min_side + 1) / 2), 2) - Math.pow(((shaped_element_cover_strip_lines_for_min_side + 1) / 2), 2));
    //      console.log(i);
    // }
    // while (i > 0);


    // const shaped_element_cover_strip_lines_for_one_side = (shaped_element_cover_strip_lines_for_min_side -1) / 2;

    // console.log(length_of_one_segment_of_hypotenus);
    // console.log(segment_count);
    // console.log(base_of_trapezoid);
    // console.log(sqrt_of_segment_count_and_base_of_trapezoid);
    // console.log(height_of_gable);




    // const sdas = height_difference - Math.sqrt(Math.pow(gable_hypotenus / ((shaped_element_cover_strip_lines_for_min_side + 1) / 2), 2) - Math.pow(((shaped_element_cover_strip_lines_for_min_side + 1) / 2), 2));
    