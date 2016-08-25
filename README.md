# Guia do Dashboar #
****

O site foi desenvolvido em:

* HTML 5
* CSS 3
* jQuery (v. 2.2.1)
* AngularJS (v. 1.5.6)
* Bootstrap (v. 3.3.6)

## Plugins ##
****

Os seguintes plugins estão sendo utilizados no site:

* [Angular Chart](https://jtblin.github.io/angular-chart.js/)
* [Angular Material](https://material.angularjs.org/latest/)
* [Angular Slider](https://github.com/angular-slider/angularjs-slider)
* [HTML 2 Canvas](https://html2canvas.hertzen.com/)
* [jsPDF](https://github.com/MrRio/jsPDF)
* [Modernizr](https://modernizr.com/)
* [Moment JS](http://momentjs.com/)
* [ngImageEditor](https://github.com/SparrowJang/ngImageEditor)
* [xlsx js](https://github.com/SheetJS/js-xlsx)

## Ambiente de desenvolvimento ##
****

Os arquivos estão distribuídos em pastas de acordo com suas funções:

> Todas as pastas possuem um index.php para evitar listagem no browser.

### Pastas ###
```
#!plaintext

- css/
- data/
- imagem/
  -- convites/
  -- savethedate/
- js/
  -- controller/
  -- directive/  
  -- factory/
  -- service/
  -- vendor/
- php/
- templates/
  -- pages/
  -- parts/
```

### Arquivos

| Arquivo | Descrição |
|---------|-----------|
|`data/convites.json`|  Possui a configuração padrão de todos os convites. A posição de cada bloco de cada convite.|
|`data/fonts.json`| Possui o nome e o ID de cada fonte para ser carregado na personalização do convite. Pode ser inserido fora da ordem mas deve respeitar a numeração do ID|
|`image/savethedate`|Local aonde ficam todos os templates dos Save the Date|
|`image/convite`|Local aonde ficam todos os backgrounds dos convites|
|`image/convite/thumb`|Local aonde ficam todos as miniaturas dos convites. Eles são usados para dar uma prévia de como será o convite|
|`js/config.js`|Setup do site. Inicialização do Angular|
|`js/dashboard.min.js`| Arquivo copilado utilizando o Gulp.|
|`php/dados.php`|Ficam armazenas o APPID e o Token. Para serem usados nas requisições ao servidor|

## Compilação  ##
****
A copilação dos arquivos é feita utilizando o [Gulp JS](http://gulpjs.com/). Para utiliza-lo será necessário o [Node JS](https://nodejs.org/en/).

### Tutorial ###
Baixe e instale o [Node JS](https://nodejs.org/en/).

Verifique se está tudo configurado digitando `node -v` no prompt de comando. 
Se retornar o numero da versão, então está tudo ok. O NodeJS não está na variável PATH de ambiente do Windows:

Clique com botão direito no ícone Meu Computador e selecione a opção Propriedades, no lado esquerdo da janela, clique no link Configurações avançadas do sistema. Na janela seguinte, acesse a aba Avançado e clique no botão Variáveis de Ambiente. De um duplo clique na variavel Path. **NÃO REMOVA** o conteúdo. Adicione no final o caminho de instalação do Node. Clique em ok.

Crie um arquivo `package.json` na raiz do site, com o seguinte conteúdo: 

```
#!json

{
  "name": "dashboard",
  "version": "1.5.0",
  "description": "Gerenciador para o site celebri",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Leo Brescia<leonardo@leobrescia.com.br>",
  "license": "ISC",
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-autoprefixer": "^3.1.0",
    "gulp-concat": "^2.6.0",
    "gulp-ng-annotate": "^2.0.0",
    "gulp-uglify": "^1.5.3",
    "gulp-util": "^3.0.7"
  }
}

```

> Por favor, utilize o arquivo `package.json` que está no repositório. A informação acima pode esta ultrapassada.

Depois abre o prompt de comando, navegue até a pasta do site e digite `npm install`. Esse comando vai instalar todos os módulos necessários para a compilação dentro de `node_modules`

> A pasta `node_modules` **NÃO** entra para o controle de versão. Ela já esta sendo ignorada pelo `.gitignore`

Depois da instalação dos módulos, crie um arquivo `gulpfile.js`, com o seguinte conteúdo: 


```
#!javascript


var gulp = require('gulp');
var util = require('gulp-util');
//concatenar
var concat = require('gulp-concat');
//minify
var uglify = require('gulp-uglify');
//para o unglify funcionar no angular
var ngAnnotate = require('gulp-ng-annotate');
var autoprefixer = require('gulp-autoprefixer');

// Compacta os js presentes na pasta js/ e minifica
// desconsidera os arquivos dentro de js/vendor
// descosidera o arquivo js/dashboard.min.js ( que eh o resultado dessa tarefa)
gulp.task('scripts', function () {
  return gulp.src(['js/**/*.js', '!js/dashboard.min.js', '!js/vendor/*.js'])
    .pipe(concat('dashboard.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('js/'));
});

gulp.task('css', function () {
  return gulp.src(['css/**/*.css'])
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 7', 'ie 8'],
      cascade: false
    }))
    .pipe(gulp.dest('css/'));
});

// Observa as modificacoes nos arquivos dentro de js/
// e aplica a tarefa scripts
gulp.task('scripts-watch', function () {
  gulp.watch(['js/**/*.js', '!js/dashboard.min.js', '!js/vendor/*.js'], ['scripts']);
});
```

> Por favor, utilize o arquivo `gulpfile.json` que está no repositório. A informação acima pode esta ultrapassada.

Pronto! Está tudo configurado. Agora é só utilizar o comando `gulp scripts`, toda vez que precisar copilar os arquivos. 

Ou pode utilizar o comando `gulp scripts-watch`. Mantenha o prompt aberto ao utilizar esse comando. Ele vai ficar "observando" alterações nos arquivos. Quando houver, ele copila automaticamente.

> Respeite a hierarquia de pastas para que o Gulp funcione

## Boas Práticas ## 
****

As práticas de desenvolvimento do site estão seguindo o guia: [Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/tree/master/a1). A tradução pode ser encontrada [aqui](https://github.com/johnpapa/angular-styleguide/blob/master/a1/i18n/pt-BR.md)