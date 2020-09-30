import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable()
export class NgbDateParserBRFormatter extends NgbDateParserFormatter  {
    readonly DT_FORMAT = 'DD/MM/YYYY';

    parse(value: string): NgbDateStruct {
        if (value) {
            value = value.trim();
            let mdt = moment(value, this.DT_FORMAT)
        }
        return null;
    }
    format(date: NgbDateStruct): string {
        if (!date) return '';
        let mdt = moment([date.year, date.month - 1, date.day]);
        if (!mdt.isValid()) return '';
        return mdt.format(this.DT_FORMAT);
    }
}
