var app = app || {};
var StorageHelper = StorageHelper || {};
var Backbone = Backbone || {};
var _ = _ || {};
var collection = collection || undefined;
var view = view || undefined;
var todo = todo || undefined;

$(function () {
  app.Model = Backbone.Model.extend({
    defaults: {
      title: '',
      status: 'act',
      check: '',
      ico: 'fa-times',
    }
  });
  // Модел данных которые будем отправлять в сторедж!
  app.COLLECTION = Backbone.Collection.extend({
    model: app.Model,
    sync: function(type) {
      var todo = StorageHelper.get('todo');
      if(type === 'read') {
        console.log('Получил все данные со стореджа->', todo);
        return todo;
      } else {
        StorageHelper.setObject('todo',this.toJSON());
      }
    }
  });

  app.VIEW = Backbone.View.extend({
    events: {
      'click #add': 'addData',
      'click li input': 'checkData',
      'click #active': 'activeBlock',
      'click #done': 'doneBlock',
      'click #remove': 'removeBlock'
    },
    initialize: function() {
      this.addCollection();
      this.render();
    },
    addData: function() {
      collection.add({
        title: $('#text').val(),
        id: StorageHelper.get('todo').length || 0
      });
      collection.sync();
      $('#text').val('');
      $('#ul li').remove();
      this.render();
    },
    addCollection: function() {
      this.collection.push(
        collection.sync('read')
      );
    },
    template: _.template($('#template').html()),
    render: function() {
       StorageHelper.get('todo').forEach(function (data) {
        this.$('#ul').append(this.template(data));
      }, this);
    },
    checkData: function(e) {
      var id = e.toElement.id;
      if(collection._byId[id].get("check") === 'checked') {
        collection._byId[id].set({
          check:'',
          status:'act'
        });
      } else {
        collection._byId[id].set({
          check:'checked',
          status:'done'
        });
      }
      collection.sync();
    },
    activeBlock: function() {
      $('#ul li').remove();
      collection.forEach(function (data) {
        if(data.get('status') === 'act') {
          this.$('#ul').append(this.template(data.toJSON()));
        }
      }, this);
    },
    doneBlock: function() {
      $('#ul li').remove();
      collection.forEach(function (data) {
        if(data.get('status') === 'done') {
          this.$('#ul').append(this.template(data.toJSON()));
        }
      }, this);
    },
    removeBlock: function() {
      $('#ul li').remove();
      collection.forEach(function (data) {
        if(data.get('status') === 'act') {
          this.$('#ul').append(this.template(data.toJSON()));
        }
      }, this);
    }
  });

  collection = new app.COLLECTION();

  view = new app.VIEW({el: 'body', collection: collection});
});

