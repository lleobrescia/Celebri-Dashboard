Celebri - Dashboard
===================
**Autor: Leo Brescia < leonardo@leobrescia.com.br>**
**Feito pela [Pixla](http://pixla.com.br/)**
**Versão: 2.0**

Dashbard para alimentar o aplicativo Celebri:
	 - [Site](https://celebri.com.br)
	 - [Apple Store](https://itunes.apple.com/br/app/celebri/id1086380503?l=en&mt=8)
	 - [Google Play](https://play.google.com/store/apps/details?id=com.pixla.celebri&hl=pt_BR)

Feito em [AngularJs](https://angularjs.org/) V.1.5.5

Estrutura
-------
A estrutura de arquivos segue o conceito [Folders-by-Feature Structure](https://github.com/johnpapa/angular-styleguide/tree/master/a1#folders-by-feature-structure)

Cada pasta, dentro de app, contem arquivos js individuais. Alguns possuem css. O build dele fica dentro de js e css. 


    /app
	    /_core
	    /casal
	    /convidado
	    /convite
		    /aplicativo
		    /cerimonia
		    /date
		    /filter
		    /personalizar
		    /selecao
		/directive
		/estatisticas
		/evento
			/cardapio
			/cotas
			/hotel
			/presentes
			/recepcao
			/salao
		/login
		/pagamento
		/services
		/sidebar
    /css
    /docs
    /image
    /js


Build
-----

Para realizar o build é preciso instalar o [NodeJS](https://nodejs.org/en/).
Apos a instalação:

 - Abra a pasta no local aonde estão os arquivos
 - Digite `npm install`

O Node ira instalar as dependências que estão configuradas no arquivo `package.json`
Uma dessas dependências é o [GULP](http://gulpjs.com/). Um automatizador de tarefas.
Existem cinco tarefas já configuradas no arquivo `gulpfile.js`:

 - `js` - Essa tarefa procura todos os arquivos javascripts dentro de app. Concatena eles, gera um arquivo `dashboard.js` dentro de /js, usado para referencias. Minifica esse arquivo gerando `dashboard.min.js` que é usado pelo site
 - `css` - Funciona da mesma maneira que o `js` porém com css
 - `img` - Procura todas as imagens dentro de `/image` diminuindo o tamanho de cada uma
 - `docs` - Gera o documento do js usando o [JSDoc](http://usejsdoc.org/) com o template do [Angular JSDoc](https://github.com/allenhwkim/angular-jsdoc).Todo o documento é baseado no arquivo `dashboard.js` e salva na pasta `/docs`
 - `watch` - Fica 'vigiando' toda alteração css, js e imagem e executa a respectiva tarefa


Documentação
-------

Toda a documentação do dashboard pode ser encontrada dentro de `/docs`
É usado o padrão  [JSDoc](http://usejsdoc.org/) para comentários e o template [Angular JSDoc](https://github.com/allenhwkim/angular-jsdoc) é usado para formatar o documento de acordo com o Angular.


Boas Práticas
-------
O dashboard foi desenvolvido usando as práticas recomendadas pelo [@john_papa](https://twitter.com/john_papa) que pode ser encontradas [aqui](https://github.com/johnpapa/angular-styleguide/tree/master/a1#folders-by-feature-structure).

Todo o modo de desenvolver está lá. Portanto, não vou repetir aqui. Por favor, leia o documento.
[Existe uma versão em português](https://github.com/johnpapa/angular-styleguide/blob/master/a1/i18n/pt-BR.md)


> Written with [StackEdit](https://stackedit.io/).