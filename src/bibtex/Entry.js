import {checkMandatoryFields} from './utils'

export default class Entry {
  constructor(id, type, fields) {
    this.fields = fields;
    this.id =id; 
    this.type =type; 
    checkMandatoryFields(this.id, this.type, this.fields);
  }
  
  sortBy(sortingFunction) {

  }

}


