// These tests should be ran in ES6 capable environment

'use strict';
/*globals describe, it*/

if (typeof new RegExp().unicode === 'undefined' || typeof new RegExp().sticky === 'undefined') {
	// Evil monkey-patching
	// This is the only way to test not yet supported flags: "y" and "u"
	const OriginalRegExp = RegExp;
	const PatchedRegExp = function PatchedRegExp(pattern, flags) {
		if (pattern == null) { pattern = ''; }

		if (flags == null) { flags = ''; }

		const re = new OriginalRegExp(pattern, flags.replace(/[uy]/g, ''));
		re.unicode = (flags.indexOf('u') !== -1);
		re.sticky = (flags.indexOf('y') !== -1);
		return re;
	};

	PatchedRegExp.__restore = function() {
		global.RegExp = OriginalRegExp;
	};

	global.RegExp = PatchedRegExp;
}

const reEquals = function (a, b) {
	return (['pattern', 'global', 'multiline', 'ignoreCase', 'sticky', 'unicode']
		.every((prop) => a[prop] === b[prop])
	);
};

let assert = require('assert');

describe('Basic', function() {
	it('should be imported', function() {
		assert.equal(typeof require('../regextag'), 'function');
	});
});

describe('Modifiers', function() {
	let r = require('../regextag');

	it('should work with no dict provided', function() {
		assert(reEquals(
			r() ``,
			new RegExp()
		));
	});

	it('should work with empty dict provided', function() {
		assert(reEquals(
			r({}) ``,
			new RegExp()
		));
	});

	it('should work with global flag', function() {
		assert(reEquals(
			r({global: true}) ``,
			new RegExp('', 'g')
		));
	});

	it('should work with ignoreCase flag', function() {
		assert(reEquals(
			r({ignoreCase: true}) ``,
			new RegExp('', 'i')
		));
	});

	it('should work with multiline flag', function() {
		assert(reEquals(
			r({multiline: true}) ``,
			new RegExp('', 'm')
		));
	});

	it('should work with unicode flag', function() {
		assert(reEquals(
			r({unicode: true}) ``,
			new RegExp('', 'u')
		));
	});

	it('should work with sticky flag', function() {
		assert(reEquals(
			r({sticky: true}) ``,
			new RegExp('', 'y')
		));
	});

	it('should work with all known modifiers', function() {
		assert(reEquals(
			r({
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: true,
				sticky: true
			}) ``,
			new RegExp('', 'imguy')
		));
	});
});

describe('Patterns', function() {
	let r = require('../regextag');

	it('should use patterns', function() {
		assert(reEquals(
			r() `Oh, hi!`,
			new RegExp('O, hi!')
		));
	});

	it('should keep escaped chars', function() {
		assert(reEquals(
			r() `\a\b\c\s\t\u0020`,
			new RegExp('\\a\\b\\c\\s\\t\\u0020')
		));
	});
});

describe('Substitutions', function() {
	let r = require('../regextag');

	it('should use substs', function() {
		assert(reEquals(
			r() `foo${ 'test' }bar`,
			new RegExp('footestbar')
		));
	});

	it('should escape chars', function() {
		assert(reEquals(
			r() `${ '.^$*+?()[-]{\|' }`,
			new RegExp('\\.\\^\\$\\*\\+\\?\\(\\)\\[\\-\\]\\{\\\\\\|')
		));
	});
});

describe('Verbose', function() {
	let r = require('../regextag');

	it('should ignore whitespaces in verbose mode', function() {
		assert(reEquals(
			r({verbose: true}) ` foo bar baz `,
			new RegExp('foobarbaz')
		));
	});

	it('should ignore newlines in verbose mode', function() {
		assert(reEquals(
			r({verbose: true}) `
				foo
				bar
				baz
			`,
			new RegExp('foobarbaz')
		));
	});

	it('should use #-styled comments', function() {
		assert(reEquals(
			r({verbose: true}) `
				foo # the foo
				bar # the bar
				baz # and the baz
			`,
			new RegExp('foobarbaz')
		));
	});

	it('should keep escaped whitespaces and hashes as is', function() {
		assert(reEquals(
			r({verbose: true}) `
				foo \# not the comment anymore
				bar\ baz
			`,
			new RegExp('foo\#notthecommentanymorebar\ baz')
		));
	});
});

describe('dotAll', function() {
	let r = require('../regextag');

	it('should use dotAll', function() {
		assert(reEquals(
			r({dotAll: true}) `.*`,
			new RegExp('[^]*')
		));
	});

	it('should replace all the dots if dotAll is used', function() {
		assert(reEquals(
			r({dotAll: true}) `.*.+.?.{2,3}`,
			new RegExp('[^]*[^]+[^]?[^]{2,3}')
		));
	});

	it('should NOT replace dots inside character classes', function() {
		assert(reEquals(
			r({dotAll: true}) `[,.]`,
			new RegExp('[,.]')
		));
	});

	it('should NOT replace escaped dots', function() {
		assert(reEquals(
			r({dotAll: true}) `\.`,
			new RegExp('\.')
		));
	});
});
