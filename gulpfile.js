 
const { dest, src, watch, parallel, series } = require('gulp'); // Подключение из gulp

const scss = require('gulp-sass'); // Подключение плагина gulp-sass
const concat = require('gulp-concat'); // Подключение плагина gulp-concat
const browserSync = require('browser-sync').create(); // Подключение плагина browser-sync
const uglify = require('gulp-uglify-es').default; // Подключение плагина gulp-uglify-es
const autoprefixer = require('gulp-autoprefixer'); // Подключение плагина autoprefixer
const imagemin = require('gulp-imagemin'); // Подключение плагина imagemin
const del = require('del');


// Функция запуска сервера browser-sync
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return del('docs');
}


// Функция сжатия картинок
function images() {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])) // оптимизация картпнок
        .pipe(dest('docs/images'));
}

// Функция минификации js
function scripts() {
    return src([
        // '',  прочие файлы js
        'app/js/main.js' // главный js файл
    ])
    .pipe(concat('main.min.js')) // название минифицированого файла
    .pipe(uglify()) // конкатинация файлов js
    .pipe(dest('app/js')) // папка в которую сохранить готовый файл
    .pipe(browserSync.stream()); // Запуск browser-sync
}

// Функция кораентации стилей scss в css
function styles() {
    return src('app/scss/style.scss', { sourcemaps: true }) // Путь к файлу scss
        .pipe(scss({outputStyle: 'compressed'})) // Обработка плагином scss, сжать css (outputStyle: 'compressed')
        .pipe(concat('style.min.css')) // Переиминовать в style.min.css
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'], // автопрефиксер на 10 последних версий
            grid: true 
        }))
        .pipe(dest('app/css', { sourcemaps: true })) // Куда сохранить корментированый фалй
        .pipe(browserSync.stream()); // Запуск browser-sync
}

// Функция сборки проекта
function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/*.min.js',
        'app/*.html'
    ], {base: 'app'}) // Базовая директория (для переброса файлов в папках)
        .pipe(dest('docs')); // Сохранить в папку dist
}

// Функция слежение за файлами
function watching() {
    watch(['app/scss/**/*.scss'], styles); // Файлы за которыйми нужно слдеить и запустить styles
    watch(['app/js/**/*.js' ,'!app/js/main.min.js'], scripts); // Файлы за которыйми нужно слдеить и запустить scripts
    watch(['app/*.html']).on('change', browserSync.reload); // Запуск browser-sync
}

// Запукс функций styles, watching, browser-sync
exports.styles = styles; 
exports.watching = watching;
exports.browsersync = browsersync; 
exports.scripts = scripts; 
exports.images = images; 
exports.cleanDist = cleanDist; 

// Последывательный запуск
exports.build = series(cleanDist, images, build);

// Паралельный запуск
exports.default = parallel(styles ,scripts, browsersync, watching);