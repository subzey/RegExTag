'use strict';

const _escape = function(str) {
	return String(str).replace(/[!-\/[-^{-}]/g, '\\$&');
};

const _dotAll = function(pattern) {
	let inBrace = false;
	let startIndex = 0;
	let retVal = '';
	for (let i = 0; i < pattern.length; i++) {
		let character = pattern[i];
		if (character === '\\') {
			i++;
		} else if (inBrace) {
			if (character === ']') {
				inBrace = false;
			}
		} else {
			if (character === '.') {
				retVal += pattern.slice(startIndex, i) + '[^]';
				startIndex = i + 1;
			} else if (character === '[') {
				inBrace = true;
			}
		}
	}

	return retVal + pattern.slice(startIndex);
};

const _compile = function(chunks, substitutes, flags) {
	const outChunks = [];
	for (let idx = 0; idx < chunks.length; idx++) {
		let str = chunks[idx];
		if (flags.verbose) {
			str = str.replace(/#.*|\s+/g, '');
		}

		outChunks.push(str);
		if (substitutes.length > idx) {
			outChunks.push(_escape(substitutes[idx]));
		}
	}

	let flagsStrArray = [];
	if (flags.global) {
		flagsStrArray.push('g');
	}

	if (flags.ignoreCase) {
		flagsStrArray.push('i');
	}

	if (flags.multiline) {
		flagsStrArray.push('m');
	}

	if (flags.sticky) {
		flagsStrArray.push('y');
	}

	if (flags.unicode) {
		flagsStrArray.push('u');
	}

	let pattern = outChunks.join('');
	if (flags.dotAll) {
		pattern = _dotAll(pattern);
	}

	return new RegExp(pattern, flagsStrArray.join(''));
};

export default function RegExTag(flags = {}) {
	return function({
		raw: chunks
	}, ...substitutes) {
		return _compile(chunks, substitutes, flags);
	};
}
