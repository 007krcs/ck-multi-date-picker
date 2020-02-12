import {
  PolymerElement,
  html
} from "@polymer/polymer/polymer-element.js";
import '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/slide-left-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';


class ckMonthView extends PolymerElement {

  static get properties() {
    return {
      date: {
        type: String,
        notify: true
      },
      mDateTrigger: {
        type: Number,
        value: 0,
        observer: '_mDateTriggerObserver'
      },
      isSelected: {
        type: Boolean,
        notify: true
      },
      mDate: {
        type: Object,
        notify: true
      },
      dateFormat: {
        type: String,
        value: clientStorage.get(storageType.session, 'dateFormat')
      },
      minDate: String,
      maxDate: String,
      availableDates: Array,
      monthFormat: {
        type: String,
        value: 'YYYY-MM',
      },
      dateHeading: {
        type: String,
        notify: true
      },
      daysOfWeek: {
        type: Array,
        notify: true,
        value: []
      },
      monthOf: {
        type: Number,
        notify: true
      },
      monthOfYear: {
        type: Array,
        notify: true,
        value: []
      },
      yearOf: {
        type: Number,
        notify: true
      },
      intial: {
        type: Boolean,
        value: false,
        notify: true
      },
      showAction: {
        type: Boolean,
        notify: true,
        value: false,
        observer: 'handleShow'
      },
      dateOf: {
        type: Number,
        notify: true
      },
      multidate: Boolean,
      selectedDates: {
        type: Array,
        notify: true
      },
      dayOf: {
        type: String,
        notify: true,
      },
      prevMonthDisabled: {
        type: Boolean,
        observer: '_prevMonthDisabled'
      },
      nextMonthDisabled: {
        type: Boolean,
        observer: '_nextMonthDisabled'
      },
      locale: {
        type: String,
        value: navigator.language
      },

      rangedate: Boolean,
      selectedRange: {
        type: Object,
        notify: true,
        value: {
          start: '',
          end: ''
        }
      },
      animationConfig: {
        type: Object
      }
    };
  }
  static get template() {
    return html `
            <style include="corp-app-styles">
                :host {
                    display: block;
                    margin-top: 10px;
                    --dp-default-text: var(--secondary-text-color);
                    --dp-disabled-text: var(--disabled-text-color);
                    --dp-selected-text: var(--primary-background-color);
                    --dp-selected-bg: var(--default-primary-color);
                }

                paper-button{
                    min-width: 33px;
                    border-radius: 999px;
                    margin: 0;
                    line-height: 1em;
                }

                paper-button:hover {
                    background-color: var(--dp-selected-bg);
                    color: var(--hover-color);
                }

                paper-button[disabled] {
                    background: none;
                }

                paper-button[toggles][active] {
                    background-color: var(--dp-selected-bg);
                    color: var(--hover-color);
                }

                #weekdays,.row{
                    @apply(--layout-horizontal);
                    @apply(--layout-center);
                }

                #weekdays .day {
                    font-size: 0.9em;
                }
                .day {
                    @apply(--layout-flex);
                    text-align: center;
                    min-height: 40px;
                    /*padding-left: 0.5em;
                    padding-right: 0.5em;
                    line-height: 1.6em;*/
                }
                #days{
                    padding-top: 10px;
                }

                .today, paper-button.today[disabled] {
                  background-color: var(--dp-selected-bg);
                    color: var(--hover-color);
                }

                .selected {
                    background-color: var(--dp-selected-bg);
                    color: var(--hover-color);
                }
                .stretch-content{
                  justify-content: space-between;
                }
            </style>
            <div class="horizontal layout stretch-content">

                <!-- <div class="date-heading">

                </div> -->
                <div class="">
                    <paper-icon-button disabled="[[prevMonthDisabled]]" icon="chevron-left" on-tap="_prevMonth"></paper-icon-button>
                </div>
                <div class="content-align-vertical-center">
                    {{dateHeading}}
                </div>
                <div class="">
                    <paper-icon-button disabled="[[nextMonthDisabled]]" icon="chevron-right" on-tap="_nextMonth"></paper-icon-button>
                </div>
            </div>
            <div id="weekdays">
              <template is="dom-repeat" items="[[daysOfWeek]]">
                <span class="day">{{item}}</span>
               </template>
            </div>

            <div id="days-multi-row">


            </div>
        `;
  }

  constructor() {
    super();
  }
  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */


  ready() {
    super.ready();
  }
  _mDateTriggerObserver() {

    if (this.isSelected) {
      this.set('selectedDate', this.date);
    } else {
      this.set('selectedDate', undefined);
    }
  }


  _nextMonth(e) {
    this.set('isSelected', false);

    this.nextMonth();
    this.set('mDateTrigger', this.mDateTrigger + 1);
  }
  _nextMonthDisabled() {
    if (this.maxDate && this.maxDate != '') {
      return moment(this.mDate.format("YYYY-MM-") + this.mDate.clone().daysInMonth(), 'YYYY-MM-DD') > moment(this.maxDate, this.dateFormat);
    } else {
      return false;
    }
  }
  _prevMonth() {
    this.set('isSelected', false);
    this.prevMonth();
    this.set('mDateTrigger', this.mDateTrigger + 1);
  }
  _prevMonthDisabled() {
    if (this.minDate && this.minDate != '') {
      return moment(this.mDate.format('YYYY-MM-01'), 'YYYY-MM-DD').subtract(1, 'days') < moment(this.minDate, this.dateFormat);
    } else {
      return false;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector("#days-multi-row");
  }
  handleShow() {
    if (this.showAction === true) {
      this.createMonthView();
    }
  }

  prevMonth() {
    this.set('mDate', this.mDate.subtract(1, 'months'));
    this.set('date', this.mDate.format(this.dateFormat));
    this.showAction = true;
    this.createMonthView();
  }
  nextMonth() {
    this.set('mDate', this.mDate.add(1, 'months'));
    this.set('date', this.mDate.format(this.dateFormat));
    this.showAction = true;
    this.createMonthView();
  }

  // _onNeonAnimationFinish() {

  // }

  _dayTap(e) {
    e.target.classList.remove('selected');
    var i = 0;
    for (; i < 7; i++) {
      this.daysOfWeek.push(moment().locale(this.locale).weekday(i).format('ddd'));
    }
    this.set('mDate', moment(this.mDate.format('YYYY-MM') + '-' + e.target.day, 'YYYY-MM-DD'));
    this.set('date', this.mDate.format(this.dateFormat));
    this.set('dateOf', this.mDate._d.getDate());
    this.set('yearOf', this.mDate._d.getFullYear());
    if (this.multidate) {
      if (e.target.active && this.selectedDates.indexOf(this.mDate.format(this.dateFormat)) < 0) {
        this.push('selectedDates', this.mDate.format(this.dateFormat));
      } else if (!e.target.active && this.selectedDates.indexOf(this.mDate.format(this.dateFormat)) > -1) {
        this.splice('selectedDates', this.selectedDates.indexOf(this.mDate.format(this.dateFormat)), 1);
      }
    } else if (this.rangedate) {
      if (this.selectedDates.indexOf(this.mDate.format(this.dateFormat)) < 0) {
        this.push('selectedDates', this.mDate.format(this.dateFormat));
      }
      if (this.selectedDates.length > 1) {
        this.set('selectedDates', this.selectedDates.slice(this.selectedDates.length - 2, this.selectedDates.length));
      }
      if (this.selectedDates[0]) {
        this.set('selectedRange.start', this.selectedDates[0]);
      }
      if (this.selectedDates[1]) {
        this.set('selectedRange.end', this.selectedDates[1]);
      }
      if (this.selectedRange.start != '' &&
        this.selectedRange.end != '' &&
        moment(this.selectedRange.start, this.dateFormat) > moment(this.selectedRange.end, this.dateFormat)) {
        var _start = this.selectedRange.end;
        var _end = this.selectedRange.start;
        this.set('selectedRange.start', _start);
        this.set('selectedRange.end', _end);
      }
      e.target.classList.add('selected');
      _toClear = Polymer.dom(this.root).querySelectorAll('.selected');
      for (var i = 0; i < _toClear.length; i++) {
        if (this.selectedDates.indexOf(_toClear[i].date) == -1) {
          _toClear[i].classList.remove('selected');
        }
      }
    } else {
      _toClear = Polymer.dom(this.root).querySelectorAll('.selected');
      for (var i = 0; i < _toClear.length; i++) {
        _toClear[i].classList.remove('selected');
      }
      e.target.classList.add('selected');
    }
    this.set('isSelected', true);
    this.set('mDateTrigger', this.mDateTrigger + 1);
  }

  createMonthView() {
    var i = 0;
    for (; i < 7; i++) {
      this.daysOfWeek.push(moment().locale(this.locale).weekday(i).format('ddd'));
    }
    this.set('date', this.mDate.format(this.dateFormat));
    this.set('dateOf', this.mDate._d.getDate());
    this.set('yearOf', this.mDate._d.getFullYear());
    this.set('dateHeading', this.mDate.format(this.dateFormat));
    this.shadowRoot.querySelector("#days-multi-row").innerHTML = '';
    var _rowElem = document.createElement('div'),
      _span = document.createElement('span');
    _rowElem.classList.add('row');
    _span.classList.add('day');
    var _date = this.mDate.clone(),
      _day = 1,
      _firstDayOfMonth = moment(_date.format('YYYY') + '-' + _date.format('MM') + '-01', 'YYYY-MM-DD'),
      _rowMod = _firstDayOfMonth.weekday(),
      _month = _date.month(),
      _mMinDate = moment(this.minDate, this.dateFormat),
      _mMaxDate = moment(this.maxDate, this.dateFormat),
      _today = moment().format('YYYY-MM-DD');
    if (_rowMod > 0) {
      for (let i = 0; i < _firstDayOfMonth.weekday(); i++) {
        _span = document.createElement('span');
        _span.classList.add('day');
        _span.innerHTML = '';
        _rowElem.appendChild(_span);
      }
    }
    while (_firstDayOfMonth.month() == _month) {
      _span = document.createElement('span');
      _span.classList.add('day');
      var _dayElem = document.createElement('paper-button');
      _dayElem.innerHTML = _day;
      _dayElem.day = _day;
      _dayElem.date = _firstDayOfMonth.format(this.dateFormat);
      if (_firstDayOfMonth < _mMinDate ||
        _firstDayOfMonth > _mMaxDate ||
        (this.availableDates && this.availableDates.indexOf(_firstDayOfMonth.format(this.dateFormat)) < 0)) {
        _dayElem.disabled = true;
      }
      if (this.multidate) {
        _dayElem.toggles = true;
      }
      if (this.selectedDates.indexOf(_firstDayOfMonth.format(this.dateFormat)) > -1) {
        _dayElem.active = true;
        _dayElem.classList.add('selected');
      }
      if (_firstDayOfMonth.format('YYYY-MM-DD') == _today) {
        // _dayElem.classList.add('');
        //_dayElem.classList.add('today');
      }

      //this.listen(_dayElem, 'tap', '_dayTap');

      _dayElem.addEventListener('tap', function (e) {
        this._dayTap(e);
      }.bind(this), false);


      _span.appendChild(_dayElem);
      _rowElem.appendChild(_span);


      _rowMod++;
      //do the increment before the if statement since 0 % 0 == 0
      if (_rowMod % 7 == 0) {
        this.shadowRoot.querySelector("#days-multi-row").appendChild(_rowElem);
        _rowElem = document.createElement('div');
        _rowElem.classList.add('row');
      }
      _day++;

      _firstDayOfMonth.add(1, 'days');
    } //end while()

    //pad the end of the month so every row has 7 elements...
    if (_rowMod % 7 != 0) {
      for (let i = 0; i < 7 - (_rowMod % 7); i++) {
        _span = document.createElement('span');
        _span.classList.add('day');
        _span.innerHTML = '';
        _rowElem.appendChild(_span);
      }
    }

    this.shadowRoot.querySelector("#days-multi-row").appendChild(_rowElem);

  }
}
window.customElements.define("ck-month-view", ckMonthView);
