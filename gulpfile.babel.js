import fs from 'fs';
import mkdirp from 'mkdirp';
import { promisify } from 'util';
import gulp from 'gulp';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import raster from 'gulp-raster';
import rename from 'gulp-rename';
import App from './src/App';
import { COUNTRIES } from './src/countries';
import { LOCALES } from './src/locales';
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const imageminPngquant = require('imagemin-pngquant');
const runSequence = require('run-sequence').use(gulp);

gulp.task('imagemin', () => {
  return gulp.src('./dist/png/**/*.png')
    .pipe(
      plugins.cache(
        plugins.imagemin([
          imageminPngquant({ quality: '65-80' }),
        ]),
      ),
    )
    .pipe(gulp.dest('./dist/png'));
  }
);

gulp.task('svg2png', () => {
  return gulp.src('./dist/svg/**/*.svg')
    .pipe(raster({format: 'png', scale: 2}))
    .pipe(rename({extname: '.png'}))
    .pipe(gulp.dest('./dist/png'));
});

gulp.task('svg', () => {
  const writeFileSync = promisify(fs.writeFileSync);

  const mkdirAndWriteFile = async (path, fileName, content) => {
    await mkdirp(path);
    await writeFileSync(`${path}${fileName}`, content);
  }

  const build = (locale, country) => {
    const { translationKey } = country;
    const sendMoneyAbroad = `SEND MONEY TO ${translationKey.toUpperCase()}`;

    const svg = ReactDOMServer.renderToStaticMarkup(<App width={620} height={325} sendMoneyAbroad={sendMoneyAbroad} />);

    mkdirAndWriteFile(`./dist/svg/${locale}/`, `${translationKey}.svg`, svg);
  };

  LOCALES.forEach(locale => {
    COUNTRIES.forEach(country => {
      build(locale, country);
    });
  });
});

gulp.task('build', done => {
  runSequence(
    'svg',
    'svg2png',
    'imagemin',
    done,
  );
});

gulp.task(
  'default',
  () =>
    new Promise(resolve => {
      runSequence('build', resolve);
    }),
);
