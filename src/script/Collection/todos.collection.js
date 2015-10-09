var app = app || {};
var Backbone = Backbone || {};
var StorageHelper = StorageHelper || {};

app.collection = Backbone.Collection.extend({
  model: app.Model,
  initialize: function () {
    console.log('[collection] initialize');
  },
  sync: function (type) {
    var todo = StorageHelper.get('todo');
    if (type === 'read') {
      console.log('[collection] sync', type);
      this.push(todo);
      console.log('Получил все данные со стореджа->', todo);
    } else {
      StorageHelper.setObject('todo', this.toJSON());
    }
    return todo;
  },
  isValidModel: function (obj) {
    console.log('[collection] isValidModel', obj);
    var model = new this.model(obj, {parse: true});
    return {
      status: model.isValid(),
      error: model.validationError
    };
  }
});
