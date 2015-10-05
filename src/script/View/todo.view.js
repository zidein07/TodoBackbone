var app = app || {};
var Backbone = Backbone || {};
var StorageHelper = StorageHelper || {};
var _ = _ || {};

var collect = new app.collection();

app.View = Backbone.View.extend({
  el: 'body',
  collection: collect,
  events: {
    'click #add': 'addData',
    'click .someJob': 'checkData',
    'click .fa-times': 'deleteImg',
    'click .fa-history': 'returnLabel'
  },
  initialize: function () {
    this.template = _.template($('#template').html());
    this.collection.sync('read');
    this.render();
  },
  addData: function () {
    var idObject = StorageHelper.get('todo').length || 0;
    var obj = {
      title: this.getVal(),
      id: idObject
    };
    var validate = collect.isValidModel(obj);
    if (!validate.status) {
      $.notify(validate.error);
      return false;
    }
    collect.add(obj, {parse: true});
    collect.sync();
    this.removeTags();
    this.render();
    this.clearVal();
  },
  getVal() {
    return $('#text').val();
  },
  clearVal() {
    return $('#text').val('');
  },
  render: function () {
    this.collection.forEach(function (data) {
      $('#ul').append(this.template(data.toJSON()));
    }, this);
    $('#ul.remove label').removeAttr('id', 'clickLabel');
    this.renderTodo();
  },
  renderTodo: function () {
    var hash = location.hash;
    console.log('hash', hash);
    this.blockRend(hash.substring(2));
  },
  checkData: function (e) {
    var id = e.toElement.id;
    console.log('this.collection._byId[id]', this.collection._byId[id]);
    var checkCol = this.collection._byId[id].get('check');
    var statusCol = this.collection._byId[id].get('status');
    var titleCol = this.collection._byId[id].get('title');
    console.log('checkCol', checkCol);
    console.log('statusCol', statusCol);
    console.log('titleCol', titleCol);
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
    this.collection.sync();
    console.log('Было удаленно задание! -> ' + colEl.get('title'));
    this.removeTags();
    this.render();
  },
  returnLabel: function (e) {
    var elId = e.toElement.parentElement.children[0].id;
    var colEl = this.collection.at(elId);
    colEl.set('status', 'active');
    colEl.set('ico', 'fa-times');
    this.collection.sync();
    console.log('Было возвращенно задание -> ' + colEl.get('title'));
    this.removeTags();
    this.render();
  },
  removeTags: function () {
    return $('#ul').find('li').remove();
  }
});
