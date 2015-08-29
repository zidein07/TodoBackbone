var app = app || {};


$(function() {
  app.Model = Backbone.Model.extend({
    defaults: {
      title: '',
      status: 'active',
      check: ''
    }
  });
  // Модел данных которые будем отправлять в сторедж!
  app.COLLECTION = Backbone.Collection.extend({model: app.Model});

  app.VIEW = Backbone.View.extend({
    events: {
        "click #add": "addItem",
        "click label": "clickLabel",
        "click #active": "activeBlock",
        "click #done": "doneBlock",
        "click #remove": "removeBlock"
    },
    template: _.template( $('#template').html() ),
    initialize: function() {
      this.renderTodo();
      this.setCollect();
    },
    render: function() {
      $('#ul li').remove();
      this.collection.each(function(col) {
        this.$('#ul').append(this.template(col.toJSON()));
      },this);
    },
    renderTodo: function() {
      if(localStorage.getItem('todo').length === 0) {
        localStorage.setItem('todo','[]');
      } else {
        $('#ul li').remove();
        this.getStorage().forEach(function(data) {
          this.$('#ul').append(this.template(data));
        },this);
      }
    },
    addItem: function() {
      var $text = $('#text');
      var textVal = $text.val();
      var textLength = textVal.length;
      var todo = JSON.parse(localStorage.getItem('todo'));
      var todoLenght = todo.length;
      var id = this.collection.length || todoLenght;
      }
      if(textLength > 0) {
        this.collection.add({
          title: textVal,
          id: id
        },this);
        if(localStorage.getItem('todo') === null) {
        localStorage.setItem('todo','[]');
        }
        $.notify('\'' + textVal + '\'' + ' Добавлено', 'success');
        console.log('[ ' + textVal + ' ] успешно добавлено');
        $text.val('');
        this.addStorage();
        this.renderTodo();
      } else {
        $.notify('Вы не можете добавить пустое задание');
      }
    },
    addStorage: function() {
      if(JSON.parse(localStorage.getItem('todo')).length > 0) {
        this.setCollect();
        localStorage.setItem('todo',JSON.stringify(collection));
      } else {
        localStorage.setItem('todo',JSON.stringify(collection));
      }
    },
    getStorage: function() {
      return JSON.parse(localStorage.getItem('todo')) || false
    },
    setCollect: function() {
      return collection.add(JSON.parse(localStorage.getItem('todo'))) || false
    },
    clickLabel: function(e) {
      var elId = e.toElement.control.id;
      if(this.collection.at(elId).get('check') != 'checked') {
        this.collection.at(elId).set('check','checked');
      } else {
        this.collection.at(elId).set('check','');
      }
      this.addStorage();
      console.log(this);
      // console.log(e);
    },
    activeBlock: function() {
      console.log('active!');
      $('#ul li').remove();
      this.collection.each(function(col) {
        if(col.get('check') !== 'checked') {
          this.$('#ul').append(this.template(col.toJSON()));
        }
      },this);
    },
    doneBlock: function() {
      console.log('done!');
      $('#ul li').remove();
      this.collection.each(function(col) {
        if(col.get('check') === 'checked') {
          this.$('#ul').append(this.template(col.toJSON()));
        }
      },this);
    },
    removeBlock: function() {
      console.log('remove!')
    }
  });

  collection = new app.COLLECTION();

  view = new app.VIEW({el: 'body',collection: collection});
});

