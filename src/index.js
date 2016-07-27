import {parseString} from 'internal/bibtex/bibtex'
import Bibliography from 'internal/bibliography/Bibliography'
import Reference from 'internal/reference/AMA/Reference'

const bibtex = {
  parseString: parseString
};

const AMA = {
  Reference: Reference
};

export {bibtex, Bibliography, AMA};
export default Bibliography;
