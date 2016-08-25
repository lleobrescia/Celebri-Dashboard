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
|`js/dashboard.min.js`| Arquivo copilado utilizando o Gulp. Informações de como foi gerado podem ser encontradas aqui|
|`php/dados.php`|Ficam armazenas o APPID e o Token. Para serem usados nas requisições ao servidor|

