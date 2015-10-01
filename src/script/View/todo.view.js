var app = app || {};
var Backbone = Backbone || {};
var StorageHelper = StorageHelper || {};
var _ = _ || {};


var collect = new app.COLLECTION();


app.View = Backbone.View.extend({
  el: 'body',
  collection: collect,
  events: {
    'click #add': 'addData',
    'click li input': 'checkData',
    'click #active': function () {
      this.blockRend('active');
    },
    'click #done': function () {
      this.blockRend('done');
    },
    'click #remove': function () {
      this.blockRend('remove');
      $('#ul li label').removeClass('clickLabel');
    },
    'click .fa-times': 'deleteImg',
    'click .fa-history': 'returnLabel'
  },
  initialize: function () {
    this.template = _.template($('#template').html());
    collect.bind('invalid', function (model, error) {
      $.notify(error);
    });
    this.addCollection();
    this.render();
  },
  addData: function () {
    var val = $.trim($('#text').val()).replace(/<[^>]+>/g, '');
    collect.add({
      title: val,
      id: StorageHelper.get('todo').length || 0
    }, {validate: true});
    collect.sync();
    this.removeTags();
    this.render();
    this.renderTodo();
    $('#text').val('');
  },
  addCollection: function () {
    this.collection.push(
      this.collection.sync('read')
    );
  },
  render: function () {
    this.collection.forEach(function (data) {
      $('#ul').append(this.template(data.toJSON()));
    }, this);
    $('#ul.remove label').removeAttr('id', 'clickLabel');
  },
  renderTodo: function () {
    var hash = location.hash;
    this.blockRend(hash);
  },
  checkData: function (e) {
    var id = e.toElement.id;
    var checkCol = this.collection._byId[id].get('check');
    var statusCol = this.collection._byId[id].get('status');
    var titleCol = this.collection._byId[id].get('title');
    if (checkCol === 'checked' && statusCol !== 'remove') {
      this.collection._byId[id].set({
        check: '',
        status: 'active'
      });
      $.notify('[' + titleCol + '] -> was unchecked!');
      console.log('[ ' + titleCol + ' ] was unchecked');
    } else {
      if (!status === 'remove' || statusCol === 'active') {
        this.collection._byId[id].set({
          check: 'checked',
          status: 'done'
        });
        $.notify('[' + titleCol + '] -> was checked!', 'success');
        console.log('[ ' + titleCol + ' ] was checked');
      }
    }
    this.removeTags();
    this.collection.sync();
    this.render();
    this.renderTodo();
  },
  blockRend: function (status) {
    this.removeTags();
    this.collection.forEach(function (data) {
      if (data.get('status') === status) {
        this.$('#ul').append(this.template(data.toJSON()));
      }
    }, this);

  },
  deleteImg: function (e) {
    var elId = e.toElement.parentElement.children[0].id;
    var colEl = this.collection.at(elId);
    colEl.set('status', 'remove');
    colEl.set('ico', 'fa-history');
    colEl.set('check', '');
    this.renderTodo();
    this.collection.sync();
    console.log('Было удаленно задание! -> ' + colEl.get('title'));
    this.removeTags();
    this.render();
    this.renderTodo();
  },
  returnLabel: function (e) {
    var elId = e.toElement.parentElement.children[0].id;
    var colEl = this.collection.at(elId);
    colEl.set('status', 'active');
    colEl.set('ico', 'fa-times');
    this.renderTodo();
    this.collection.sync();
    console.log('Было возвращенно задание -> ' + colEl.get('title'));
    this.removeTags();
    this.render();
    this.renderTodo();
  },
  removeTags: function () {
    return $('#ul li').remove();
  }
});
