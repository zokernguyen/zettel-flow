import { last } from "./utils";

export class ZettelID {
	originID: string = '';
	seperatedID: string[] = [];

	constructor(inputObj: string | ZettelID){
		if (typeof inputObj === 'string'){
			this.originID = inputObj as string;
			this.seperatingID();
		}

		if (inputObj instanceof ZettelID) {
			this.originID = inputObj.originID;
			this.seperatedID = [...inputObj.seperatedID];
		}
	}

	private seperatingID(){

		if (!this.originID)
			return

		const result = this.originID.match(/(\d+|\D+)/g);
		if(result) this.seperatedID = result;

		// "aoueoe34243euouoe34432euooue34243".match(/(\d+|\D+)/g)
		// ["aoueoe", "34243", "euouoe", "34432", "euooue", "34243"]
	}

	public genNextSiblingId(): string {
		return ZettelID.genNextSiblingId(this);
	}

	public genNextChildId(): string {
		return ZettelID.genNextChildId(this);
	}

	static genNextChildId(zettelId: ZettelID): string {
		if(!zettelId.originID)
			return '';

		let newId = new ZettelID(zettelId);
		const lastVal = last(newId.seperatedID);
		let newVal = ''

		if(lastVal) {

			// identiy whether it's number or string
			let result = parseInt(lastVal);
			if (isNaN(result)) {
				// if last characters were letters, then next would be digits
				newVal = '1';
			} else {
				newVal = 'a';

			}
			newId.seperatedID.push(newVal);
		}

		return newId.seperatedID.join('');
	}

	static genNextSiblingId(zettelId: ZettelID): string {
		if(!zettelId.originID)
			return '';

		let newId = new ZettelID(zettelId);
		const lastVal = last(newId.seperatedID);
		let newVal = ''

		if(lastVal) {

			// identiy whether it's number or string
			let result = parseInt(lastVal);
			if (isNaN(result)) {
				newVal = ZettelID.increasingLetters(lastVal);
			} else {
				newVal = (result + 1).toString(10);

			}
			newId.seperatedID.pop();
			newId.seperatedID.push(newVal);
		}

		return newId.seperatedID.join('');
	}

	
	static increasingDigit(digit: string): string {
		let result = parseInt(digit);
		return (result + 1).toString(10);
	}

	// may reference from https://stackoverflow.com/a/12504061
	static increasingLetters(letters: string): string {
		let result = letters;
		let lastChar = result.charAt(letters.length - 1);
		if (lastChar === 'z')
			return result + 'a';
		else {
			return result.replace(/\w$/i, String.fromCharCode(lastChar.charCodeAt(0) + 1));
		}
	}
}