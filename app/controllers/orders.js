import Ember from 'ember';

export default Ember.Controller.extend({
  orders: null,
  notOrdersYet: false,
  ordersDate: null,
  numberSoups: 0,
  numberDrinks: 0,
  orderImg: '',
  phoneNumber : 573146543291,
  urlMessage: '',

  actions: {
    exportOrders: function(){
      var data = [
          [],
          ['', '', 'ORDENES', '', '', ''],
          [],
          ['FECHA', this.ordersDate, '', '', '', ''],
          [],
          ['NUMERO DE SOPAS', this.numberSoups, '', '', '', ''],
          ['NUMERO DE BEBIDAS', this.numberDrinks, '', '', '', ''],
          [],
          ['Nombre', 'Proteina', 'Acompañamietos', 'Adicionales', 'Sopa', "Bedida"]
      ];

      for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i];
        console.log(order);
        var accomps = order.order.accomps.join(", ");
        var soup = order.order.soup ? "SI" : "NO";
        var drink = order.order.drink ? "SI" : "NO";

        data.push([order.user.displayName, order.order.protein, accomps, order.order.addition, soup, drink ]);
      }

      this.get('excel').export(data, {sheetName: 'Ordenes', fileName: 'ordenes.xlsx'});

    },

    downloadOrdersImg: function() {
      var table = Ember.$('#ordersTable');

      html2canvas(table, {
        onrendered: function(canvas) {
          canvas.toBlob(function(blob) {
            saveAs(blob, "orders.png");
          }, "image/png");
        }
      });
    },
  },

  setupOrders : function functionName() {
    if (this.orders.length === 0) {
      this.set('notOrdersYet', true);
    } else {
      this.set('notOrdersYet', false);
      for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i]
        order.user.alias = this.generateAlias(order.user.displayName);
        if(order.order.soup) {
          this.set("numberSoups", this.numberSoups + 1 );
        }
        if(order.order.drink) {
          this.set("numberDrinks", this.numberDrinks + 1 );
        }
      }

      this.shareOrders();
    }
  },

  shareOrders: function() {
    var orders = this.orders;
    var text = `NUMERO DE SOPAS: ${this.numberSoups}, NUMERO DE BEBIDAS': ${this.numberDrinks}\n` ;
    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];
      var accomps = order.order.accomps.join(", ");
      text = text + `${this.generateAlias(order.user.displayName)}  -> ${order.order.protein}, ${accomps}, ${order.order.addition} \n\n`;
    }
    this.set('urlMessage', `https://api.whatsapp.com/send?=${this.phoneNumber}&text=${encodeURI(text)}`);
  },

  cleanController: function () {
    this.set('orders', null);
    this.set('notOrdersYet', false);
    this.set('ordersDate', null);
    this.set('numberSoups', 0);
    this.set('numberDrinks', 0);
  },

  generateAlias: function (name) {
    var splitedName = name.split(" ");
    return `${splitedName[0]} ${splitedName[1].charAt(0)}`
  }

});
