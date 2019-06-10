"use strict";
var Table = (function () {
    function Table() {
    }
    Table.prototype.splitStringToTable = function (str) {
        return this.trim(String(str)).split('\n').map(function (row) {
            row = row.replace(/^[\|\s]+/, '');
            row = row.replace(/[\|\s]+$/, '');
            return row.split('|').map(function (str) { return str.trim(); });
        });
    };
    Table.prototype.getMaxLengthPerColumn = function (table) {
        var _this = this;
        return table[0].map(function (str, column_index) {
            return _this.getMaxLength(_this.getColumn(table, column_index));
        });
    };
    Table.prototype.getMaxLength = function (array) {
        // chinese character
        var reg = /[\u4e00-\u9fa5]/g;
        return array.reduce(function (max, item) {
            var _length = item.length;
            // handler chinese
            if (!(item instanceof Array) && reg.test(item)) {
                _length = _length - item.match(reg).length + Math.floor((item.match(reg).length) / 3 * 5);
            }
            return Math.max(max, _length);
        }, 0);
    };
    Table.prototype.padHeaderSeparatorString = function (str, len) {
        switch (this.getAlignment(str)) {
            case 'l': return this.repeatStr('-', Math.max(3, len));
            case 'c': return ':' + this.repeatStr('-', Math.max(3, len - 2)) + ':';
            case 'r': return this.repeatStr('-', Math.max(3, len - 1)) + ':';
        }
    };
    Table.prototype.getAlignment = function (str) {
        if (str[str.length - 1] === ':') {
            return str[0] === ':' ? 'c' : 'r';
        }
        return 'l';
    };
    Table.prototype.fillInMissingColumns = function (table) {
        var max = this.getMaxLength(table);
        table.forEach(function (row, i) {
            while (row.length < max) {
                row.push(i === 1 ? '---' : '');
            }
        });
    };
    Table.prototype.getColumn = function (table, column_index) {
        return table.map(function (row) {
            return row[column_index];
        });
    };
    Table.prototype.trim = function (str) {
        return str.trim();
    };
    Table.prototype.padStringWithAlignment = function (str, len, alignment) {
        switch (alignment) {
            case 'l': return this.padRight(str, len);
            case 'c': return this.padLeftAndRight(str, len);
            case 'r': return this.padLeft(str, len);
        }
    };
    Table.prototype.padLeft = function (str, len) {
        var reg = /[\u4e00-\u9fa5]/g;
        var _length = str.length;
        if (reg.test(str)) {
            _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5);
        }
        return this.getPadding(len - _length) + str;
    };
    Table.prototype.padRight = function (str, len) {
        var reg = /[\u4e00-\u9fa5]/g;
        var _length = str.length;
        if (reg.test(str)) {
            _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5);
        }
        return str + this.getPadding(len - _length);
    };
    Table.prototype.padLeftAndRight = function (str, len) {
        var reg = /[\u4e00-\u9fa5]/g;
        var _length = str.length;
        if (reg.test(str)) {
            _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5);
        }
        var l = (len - _length) / 2;
        return this.getPadding(Math.ceil(l)) + str + this.getPadding(Math.floor(l));
    };
    Table.prototype.getPadding = function (len) {
        return this.repeatStr(' ', len);
    };
    Table.prototype.repeatStr = function (str, count) {
        return count > 0 ? Array(count + 1).join(str) : '';
    };
    Table.prototype.reformat = function (str) {
        var _this = this;
        var self = this;
        var table = this.splitStringToTable(str), alignments, max_length_per_column;
        // table[1] = table[1].map(function (cell) {
        //     return this.padHeaderSeparatorString(cell, 0);
        // });
        table[1] = table[1].map(function (cell) {
            return _this.padHeaderSeparatorString(cell, 0);
        });
        this.fillInMissingColumns(table);
        alignments = table[1].map(this.getAlignment);
        max_length_per_column = this.getMaxLengthPerColumn(table);
        return table.map(function (row, row_index) {
            return '|' + row.map(function (cell, column_index) {
                var column_length = max_length_per_column[column_index];
                if (row_index === 1) {
                    return self.padHeaderSeparatorString(cell, column_length + 2);
                }
                return ' ' + self.padStringWithAlignment(cell, column_length, alignments[column_index]) + ' ';
            }).join('|') + '|';
        }).join('\n') + '\n';
    };
    ;
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=Table.js.map