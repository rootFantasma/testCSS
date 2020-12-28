//Optimización HTML
import htmlmin from 'gulp-htmlmin'

//CSS
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'

import less from 'gulp-less'

import clean from 'gulp-purgecss'


//Optimización JS
import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

//PUG
import pug from 'gulp-pug'

//Concatenación
import concat from 'gulp-concat'

//Limpia cache navegador
import cacheBust from 'gulp-cache-bust'


//Optimizacion Img
import imagemin from 'gulp-imagemin'


import { init as server, stream, reload} from 'browser-sync'


import plumber from 'gulp-plumber'

//Ambiete
const production = false

//CSS Plugins
const cssPlugins = [
	cssnano(),
	autoprefixer()
]


//Tarea minifica el HTML
gulp.task('html-min', () => {
	return gulp
		.src('./src/*.html')
		.pipe(plumber())
		.pipe(htmlmin({
			collapseWhitespace:true,
			removeComments:true
		}))
		.pipe(cacheBust({
			type: 'timestamp'
		}))
		.pipe(gulp.dest('./public/'))
})


//Tarea CSS
gulp.task('styles', () => {
	return gulp
		.src('./public/css/style.css')
		.pipe(plumber())
		.pipe(concat('style.css'))
		.pipe(postcss(cssPlugins))
		.pipe(gulp.dest('./public/css/'))
		.pipe(stream())
})


//Tarea JS - Minifica, Ofusca y soporte para todos los navegadores.
gulp.task('babel', () => {
	return gulp
		.src('./src/js/*.js')
		.pipe(plumber())
		.pipe(concat('app.min.js'))
		.pipe(babel())
		.pipe(terser())
		.pipe(gulp.dest('./public/js'))
})


//Tarea Views
gulp.task('views', () => {
	return gulp.src('./src/views/pages/*.pug')
	.pipe(plumber())
	.pipe(pug({
		prety: production ? false : true
	}))
	.pipe(gulp.dest('./public'))
})

//Tarea LESS
gulp.task('less', () => {
	return gulp.src('./src/less/style.less')
	.pipe(plumber())
	.pipe(less())
	.pipe(gulp.dest('./public/css'))
	.pipe(stream())
})

//Tarea Limpiar CSS
gulp.task('clean', () => {
	return gulp.src('./public/css/style.css')
	.pipe(plumber())
	.pipe(clean({
		content: ['./public/*.html']
	}))
	.pipe(gulp.dest('./public/css'))
})

gulp.task('imgmin', () => {
	return gulp.src('./src/img/**')
	.pipe(plumber())
	.pipe(imagemin([
		imagemin.gifsicle({ intercaled: true }),
		imagemin.mozjpeg({ quality: 30, progressive: true }),
		imagemin.optipng({ optimizationLevel: 1 })
		]))
	.pipe(gulp.dest('./public/img'))
})

//Agrupa todas las tareas.
gulp.task('default', () =>{

	server({
		server:'./public'
	})

	//gulp.watch('./src/less/style.less', gulp.series('styles'))
	//gulp.watch('./src/views/**/*.pug', gulp.series('views')).on('change', reload)
	gulp.watch('./src/*.html', gulp.series('html-min')).on('change', reload)
	gulp.watch('./src/less/**/*.less', gulp.series('less'))
	gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload)
})