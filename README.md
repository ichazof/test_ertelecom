## Установка
`npm install` — установка зависимостей

`npm run build`  — запускает линтеры и собирает проект
В файле src/js/index.js переменная  'handler' отвеает за отправку запросов на бэкэнд. При сборке прокта папка handler копируется в build. 

В папке /handler/src/Workers.php  вначале записаны параметры подключения к БД. 

## Организация структуры проекта
- build/ - сюда складывается билд верстки после сборки
- src/ - исходники кода проекта
- - img/ - интерфейсные картинки (которые мы используем из css-файлов). При сборке сжимаются и перекладываются в build
- - images/ - контентные картинки, которые подключаются непосредственно из html/
- - js/ - исходники JS-кода
- - style/ - папка для всех стилей проекта 
- - - style.scss - точка входа для всех стилей
- - - commons/ -папка для файлов с общими стилями проекта (типа шрифтов, body etc)
- - templates/ - папка для Pug файлов

## Таски 
`npm start` — запускает среду для разработки с livereload

`npm run build`  — запускает линтеры и собирает проект



