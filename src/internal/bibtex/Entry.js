import {mandatoryFields, optionalFields} from './utils'
import referenceTypes from '../bibliography/ReferenceFormats'

function checkMandatoryFields(id, type, fields) {
  const mandatory = mandatoryFields[type] || [];
  //const optionalFields = optionalFields[type] || [];

  mandatory.forEach(field => {
    if (typeof field == 'string') {
      if (!fields[field]) console.warn("Warning: expected " + type + " with id " + id
        + " to have the field: " + field);
    } else if (!field.reduce((fieldName, acc) => acc && fields[fieldName])) {
      // not one of a list of options
      console.warn("Expected " + type + " with id " + id
        + " to have one of the following fields: " + field);
    }
  });
}

export default class Entry {
  constructor(id, type, fields) {
    this.fields = fields;
    this.id = id;
    this.type = type;
    checkMandatoryFields(this.id, this.type, this.fields);
  }
}


