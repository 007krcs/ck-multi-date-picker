import {
  PolymerElement,
  html
} from "@polymer/polymer/polymer-element.js";
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
// import '../moment/moment.js';
import 'ck-datepicker/ck-month-view.js';

class ckDatepicker extends PolymerElement {
  static get template() {
    return html `
            <style include="corp-app-styles">
                :host {
                    display: block;
                    width: 100%;
                    --primary-bg-color: var(--paper-red-500);
                    --hover-bg-color: var(--paper-grey-200);
                    --dpg-header-text: var(--primary-background-color);
                    --dpg-default-background: var(--primary-background-color);
                    --dpg-header-background: var(--default-primary-color);
                    --dpg-dark-background: var(--dark-primary-color);
                    --hover-color: white;
                    --today-bg-color: #eceff1;
                }

                @media (max-width: 600px) {
                .header {
                  display: none !important;
                }
                #dialog {
                  min-width: 300px;
                }
              }


              @media (min-width: 601px) {

                  #dialog {
                    min-width: 435px;
                  }
              }

              .container-ele{

                height: 300px;
                overflow: auto;
                padding: auto;
                margin-left: 0%;
                margin-right: 0%;
                padding-bottom: 0%;

                }

                .selected-date {
                    max-height: 15%;
                    min-height: 12%;
                    overflow-y: 3%;
                    align-items: center;
                }
                .padding-r-l{
                  padding-left: 4px;
                  padding-right: 12px;
                }
                .padding-rl{
                  padding-left: 4px;
                  padding-right: 5px;
                }
            </style>
            <!-- header -->

            <div class=" layout horizontal  no-padding">
              <div class="layout flex">
                  <div class="layout vertical">
                    <ck-month-view id="sched" date="{{date}}" days-of-week="{{daysOfWeek}}" date-heading="{{dateHeading}}" day-of="{{dayOf}}"  month-of="{{monthOf}}" year-of="{{yearOf}}" date-of="{{dateOf}}" m-date="{{mDate}}" date-format="{{dateFormat}}" m-date-trigger="{{mDateTrigger}}" is-selected="{{isSelected}}" min-date="{{minDate}}" max-date="{{maxDate}}" available-dates="{{availableDates}}" multidate="[[multidate]]" selected-dates="{{selectedDates}}" rangedate="[[rangedate]]" show-action={{showAction}} selected-range="{{selectedRange}}"></ck-month-view>
                  </div>
                  <div class="layout horizontal">
                      <div class="filler"></div>
                      <paper-button id="cancelBtn" dialog-dismiss on-tap="_onCancel">
                          <oe-i18n-msg msgid="cancel">Cancel</oe-i18n-msg>
                      </paper-button>
                      <paper-button id="okBtn" dialog-confirm on-tap="_onOK">
                          <oe-i18n-msg msgid="ok">OK</oe-i18n-msg>
                      </paper-button>
                  </div>
              </div>
              <div class="layout vertical container-ele background-secondary">

                  <template is="dom-if" if="[[multidate]]">
                  <div class="padding-rl"> Selected dates: {{selectedDates.length}}</div>
                      <template is="dom-repeat" items="[[selectedDates]]">
                        <div class="selected-date horizontal layout">
                          <div class="padding-r-l">
                              [[item]]
                          </div>
                          <div>
                            <paper-icon-button icon="close" on-tap="_multidateRemove" class="padding-zero iron-icon-style-s"></paper-icon-button>
                          </div>
                        </div>
                    </template>
                </template>
              </div>
            </div>

        `;
  }
  static get properties() {
    return {
      dateFormat: {
        type: String,
        notify: true,
        value: clientStorage.get(storageType.session, 'dateFormat')
      },
      showAction: {
        type: Boolean,
        notify: true,
        value: false
      },
      dayOf: {
        type: String,
        notify: true,
        observer: 'handleDay'
      },
      dateOf: {
        type: Number,
        notify: true
      },
      monthOf: {
        type: Number,
        notify: true
      },
      yearOf: {
        type: Number,
        notify: true
      },
      headingSelectedFormat: {
        type: String,
        value: 'MMMM YYYY'
      },
      headingNotSelectedFormat: {
        type: String,
        value: 'MMMM YYYY'
      },
      mDate: {
        type: Object,
        notify: true,
        value: moment()
      },
      mDateTrigger: {
        type: Number,
        value: 0,
        observer: '_mDateTriggerObserver'
      },
      date: {
        type: String,
        notify: true,
        computed: '_computeDate(mDateTrigger)'
      },
      daysOfWeek: {
        type: Object,
        notify: true
      },
      selectedDate: {
        type: String,
        notify: true
      },
      multidate: {
        type: Boolean,
        value: false
      },
      selectedDates: {
        type: Array,
        notify: true,
        value: ["02,13,2020", "02,14,2020", "02,15,2020", "02,22,2020", "02,21,2020", "02,29,2020"]
      },
      rangedate: {
        type: Boolean,
        value: false
      },
      selectedRange: {
        type: Object,
        notify: true,
        value: {
          start: '',
          end: ''
        }
      },
      // _nonCompatPropz: {
      //   type: String,
      //   computed: '_computeNonCompatPropz'
      // },
      dateHeading: {
        type: String,
        notify: true,
        observer: '_computeDateHeading'
      },
      todayHidden: {
        type: Boolean,
        observer: '_todayHidden'
      },
      prevMonthDisabled: {
        type: Boolean,
        observer: '_prevMonthDisabled'
      },
      nextMonthDisabled: {
        type: Boolean,
        observer: '_nextMonthDisabled'
      },
      isSelected: {
        type: Boolean,
        notify: true,
        value: false
      },
      availableDates: {
        type: Array,
        observer: '_availableDatesObserver'
      },
      minDate: {
        type: String,
        value: '',
        observer: '_minDateObserver'
      },
      maxDate: {
        type: String,
        value: ''
      }
    };
  }
  _computeDate(mDateTrigger) {
    return this.mDate.format(this.dateFormat);
  }
  connectedCallback() {
    super.connectedCallback();
    this.isSelected = true;
    var node = this.shadowRoot.querySelector("#sched");
    node.createMonthView();
  }
  constructor() {
    super();

  }

  handleDay() {
    console.log("day Of : " + this.dayOf);
  }
  _computeDateHeading() {

    if (this.isSelected) {
      this.dateHeading = this.mDate.format(this.headingSelectedFormat);
    } else {
      this.dateHeading = this.mDate.format(this.headingNotSelectedFormat);
    }
  }
  // _computeNonCompatPropz() {
  //   if (multidate && rangedate) {

  //     this.set('rangedate', false);
  //   }
  // }
  _mDateTriggerObserver(_mDate) {

    if (this.isSelected) {
      this.set('selectedDate', this.date);
    } else {
      this.set('selectedDate', undefined);
    }
  }

  _availableDatesObserver() {

    this.async(function () {
      var node = this.shadowRoot.querySelector("#sched");

      node.createMonthView();
    }, 50);
  }

  _minDateObserver() {
    if (this.minDate &&
      this.minDate != '' &&
      moment(this.minDate, this.dateFormat) > moment()) {
      this.set('mDate', moment(this.minDate, this.dateFormat));
      this.set('mDateTrigger', this.mDateTrigger + 1);
      this.async(function () {
        var node = this.shadowRoot.querySelector("#sched");
        // if(node){}
        node.createMonthView();
      }, 100);
    }
  }

  _today() {
    this.set('isSelected', false);
    this.set('mDate', moment());
    this.set('mDateTrigger', this.mDateTrigger + 1);
    var node = this.shadowRoot.querySelector("#sched");
    node.createMonthView();
  }
  _todayHidden() {
    if (this.minDate && this.minDate != '' && moment() < moment(this.minDate, this.dateFormat)) {
      return true;
    }
    if (this.maxDate && this.maxDate != '' && moment() > moment(this.maxDate, this.dateFormat)) {
      return true;
    }
    return false;
  }

  _prevMonth() {
    this.set('isSelected', false);
    var node = this.shadowRoot.querySelector("#sched");
    node.prevMonth();
    this.set('mDateTrigger', this.mDateTrigger + 1);
  }
  _prevMonthDisabled() {
    if (this.minDate && this.minDate != '') {
      //is the last day of the previous month < minDate?
      return moment(this.mDate.format('YYYY-MM-01'), 'YYYY-MM-DD').subtract(1, 'days') < moment(this.minDate, this.dateFormat);
    } else {
      return false;
    }
  }

  _nextMonth() {
    this.set('isSelected', false);
    var node = this.shadowRoot.querySelector("#sched");
    node.nextMonth();
    this.set('mDateTrigger', this.mDateTrigger + 1);
  }
  _nextMonthDisabled() {
    if (this.maxDate && this.maxDate != '') {
      return moment(this.mDate.format("YYYY-MM-") + this.mDate.clone().daysInMonth(), 'YYYY-MM-DD') > moment(this.maxDate, this.dateFormat);
    } else {
      return false;
    }
  }

  _multidateRemove(e) {
    this.splice('selectedDates', this.selectedDates.indexOf(e.model.item), 1);
    //if the date is in the month view currently displayed, redraw to clear selection...
    if (this.mDate.format('YYYY-MM') == moment(e.model.item, this.dateFormat).format('YYYY-MM')) {
      var node = this.shadowRoot.querySelector("#sched");
      node.createMonthView();
    }

  }
}
window.customElements.define("ck-datepicker", ckDatepicker);