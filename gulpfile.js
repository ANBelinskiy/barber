var gulp         = require('gulp')              , // Подключаем Gulp
	sass         = require('gulp-sass')         , //Подключаем Sass пакет,
	browserSync  = require('browser-sync')      , // Подключаем Browser Sync
	concat       = require('gulp-concat')       , // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs')     , // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano')      , // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename')       , // Подключаем библиотеку для переименования файлов
	del          = require('del')               , // Подключаем библиотеку для удаления файлов и папок
	cache        = require('gulp-cache')        , // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer') ;// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){                       // Создаем таск Sass
	return gulp.src('app/scss/main.scss')           // Берем источник
		.pipe(sass())                               // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css'))                 // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true}))   // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() {      // Создаем таск browser-sync
	browserSync({                           // Выполняем browserSync
		server: {                           // Определяем параметры сервера
			baseDir: 'app'                  // Директория для сервера - app
		},
		notify: false                       // Отключаем уведомления
	});
});

gulp.task('scripts', function() {
return gulp.src([                           // Берем все необходимые библиотеки
	'app/js/libs/jquery.min.js'	            ,               
	'app/js/libs/bootstrap.min.js'	        ,
	'app/js/libs/jquery.validate.min.js'    ,
	'app/js/libs/wow.min.js'			    ,
	'app/js/libs/form.js'                   ,
	'app/js/libs/slow_scroll.js'	        ,
	//  'app/js/libs/slick.min.js'          ,
	'app/js/libs/imagesloaded.pkgd.min.js'  ,
	// 'app/js/libs/jquery-imagefill.js'    ,   // скрипт выравнивания изображений
												// в css .item{min-width: 200+}
												// в js $('.item').imagefill(); добавляем*

												// var $container = $(".masonry-container");
												// $container.imagesLoaded(function () {
												//	$container.masonry({
												//		columnWidth: ".item",
												//		itemSelector: ".item"
												//	 });
												//* 	$('.item').imagefill();
												//   });


	'app/js/libs/masonry.pkgd.min.js'       ,
	'app/js/my.js'                          ,
		])
		.pipe(concat('all.min.js'))   // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify())                     // Сжимаем JS файл
		.pipe(gulp.dest('app/js'));         // Выгружаем в папку app/js
});



gulp.task('concat', function () {
	return gulp.src([                           // Берем все необходимые библиотеки

		'app/css/main.css'                          ,
])
		.pipe(concat("all.css"))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({stream: true}))   // Обновляем CSS на странице при изменении
});


gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/main.css')     // Выбираем файл для минификации
		.pipe(cssnano())                    // Сжимаем
		.pipe(rename({suffix: '.min'}))     // Добавляем суффикс .min
		.pipe(gulp.dest('app/css'));        // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'concat'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass', 'concat']);       // Наблюдение за sass файлами в папке sass
	gulp.watch('app/*.html', browserSync.reload);       		// Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);   		// Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('build', ['clean', 'sass', 'concat', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/**/*'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*')       // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')      // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);