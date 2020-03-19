import {
  PolymerElement,
  html
} from "@polymer/polymer/polymer-element.js";
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-icons/iron-icons.js';
import './ck-datepicker.js';

class ckDatepickerDialog extends PolymerElement {
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
                #dialog:host > ::content > *:first-child {
                  margin-top: 0;
                }
            .content-border{
                border-bottom: 1px solid black;
                margin-bottom : inherit;
                height:50px;
              }
              .content-fix{
                margin:4px, 4px;
                padding:inherit;
                /* width: inherit; */
                height: 50px;
                overflow-x: hidden;
                overflow-y: auto;
                width: 100%;
              }
            .datePlacholder{
              padding-right:8px;
              display: inline-block;
            }
            [contentEditable=false]:empty:not(:focus):before
              {
                content:attr(data-placeholder)
              }
            /* .selected-date{
              display: flex !important;
              width:100%;
            } */
            @media (max-width: 600px) {
                .header {
                  display: none !important;
                }
                #dialog {
                  min-width: 300px;
                };
              }

            @media (min-width: 601px) {

                #dialog {
                  min-width: 450px;
                };
            }

        </style>
          <div class="mdl-grid">
            <div class="horizontal layout content-border full-width" >
                <div class="content-fix layout font-size-m">

                    <template is="dom-repeat" items="[[selectedDates]]" restamp>
                        <div contentEditable="false" data-placeholder="Enter name here" class="datePlacholder">{{showData(item)}}</div>
                    </template>
                </div>
              <paper-icon-button  id="schedule_date_icon" icon="date-range" on-tap="openSchedDatepicker" aria-label$="{{getLabel('l_date')}}"></paper-icon-button>
            </div>
          </div>
          <paper-dialog aria-modal="true" modal id="dialog" on-keydown="_handleEscape">
              <div class="scrollable-content height-for-content-div">
                <ck-datepicker date="{{date}}" m-date="{{mDate}}" date-format="{{dateFormat}}" m-date-trigger="{{mDateTrigger}}" is-selected="{{isSelected}}" min-date="{{minDate}}" max-date="{{maxDate}}" available-dates="{{availableDates}}" multidate="[[multidate]]" selected-dates="{{selectedDates}}" rangedate="[[rangedate]]" selected-range="{{selectedRange}}"></ck-datepicker>
              </div>
          </paper-dialog>

        `;
  }
  static get properties() {
    return {
      dateFormat: {
        type: String,
        value: clientStorage.get(storageType.session, 'dateFormat')
      },
      closevisible: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },
      headingSelectedFormat: {
        type: String,
        value: 'ddd, MMM D, YYYY'
      },
      headingNotSelectedFormat: {
        type: String,
        value: 'MMMM YYYY'
      },
      date: {
        type: String,
        notify: true
      },
      selectedDate: {
        type: String,
        notify: true
      },
      multidate: {
        type: Boolean,
        value: false,
        notify: true
      },
      selectedDates: {
        type: Array,
        notify: true,
        value: []
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
      isSelected: {
        type: Boolean,
        notify: true,
        value: false
      },
      availableDates: {
        type: Array,
        notify: true
      },
      minDate: {
        type: String,
        notify: true
      },
      maxDate: {
        type: String,
        notify: true
      }
    };
  }
  constructor() {
    super();

  }

  showData(dateString) {
    return dateString + ';';
  }
  connectedCallback() {
    super.connectedCallback();

  }
  openSchedDatepicker() {


    this.showAction = true;
    this.$.dialog.open();



  }
}
window.customElements.define("ck-datepicker-dialog", ckDatepickerDialog);
