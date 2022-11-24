export class FormatTableTool {
    proportion: number
    constructor(proportion) {
        this.proportion = proportion
    }
    splitStringToTable(str) {
        return this.trim(String(str)).split('\n').map(function (row) {
            row = row.replace(/^[\|\s]+/, '');
            row = row.replace(/[\|\s]+$/, '');
            return row.split('|').map(str => str.trim());
        });
    }
    getMaxLengthPerColumn(table) {
        return table[0].map((_, columnIndex) => {
            return this.getMaxLength(this.getColumn(table, columnIndex));
        });
    }
    getMaxLength(array) {
        const self = this
        // chinese character
        var reg = /[\u4e00-\u9fa5]/g;
        return array.reduce(function (max, item) {
            var _length = item.length;
            // handler chinese
            if (!(item instanceof Array) && reg.test(item)) {
                _length = _length - item.match(reg).length + Math.floor((item.match(reg).length) * self.proportion);
            }
            return Math.max(max, _length);
        }, 0);
    }
    padHeaderSeparatorString(str, len) {
        switch (this.getAlignment(str)) {
            case 'l': return this.repeatStr('-', Math.max(3, len));
            case 'c': return ':' + this.repeatStr('-', Math.max(3, len - 2)) + ':';
            case 'r': return this.repeatStr('-', Math.max(3, len - 1)) + ':';
        }
    }
    getAlignment(str) {
        if (str[str.length - 1] === ':') {
            return str[0] === ':' ? 'c' : 'r';
        }
        return 'l';
    }
    fillInMissingColumns(table) {
        var max = this.getMaxLength(table);
        table.forEach(function (row, i) {
            while (row.length < max) {
                row.push(i === 1 ? '---' : '');
            }
        });
    }
    getColumn(table, columnIndex) {
        return table.map(function (row) {
            return row[columnIndex];
        });
    }
    trim(str) {
        return str.trim();
    }
    padStringWithAlignment(str, len, alignment) {
        switch (alignment) {
            case 'l': return this.padRight(str, len);
            case 'c': return this.padLeftAndRight(str, len);
            case 'r': return this.padLeft(str, len);
        }
    }
    padLeft(str, len) {
        var reg = /[\u4e00-\u9fa5]/g;
        var _length = str.length;
        if (reg.test(str)) {
            _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) * this.proportion);
        }
        return this.getPadding(len - _length) + str;
    }
    padRight(str, len) {
        var reg = /[\u4e00-\u9fa5]/g;
        var _length = str.length;
        if (reg.test(str)) {
            _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) * this.proportion);
        }
        return str + this.getPadding(len - _length);
    }
    padLeftAndRight(str, len) {
        var reg = /[\u4e00-\u9fa5]/g;
        var _length = str.length;
        if (reg.test(str)) {
            _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) * this.proportion);
        }
        var l = (len - _length) / 2;
        return this.getPadding(Math.ceil(l)) + str + this.getPadding(Math.floor(l));
    }
    getPadding(len) {
        return this.repeatStr(' ', len);
    }
    getChinesePadding(len) {
        return this.repeatStr('　', len);
    }
    repeatStr(str, count) {
        return count > 0 ? Array(count + 1).join(str) : '';
    }
    reformat(str) {
        const self = this;
        var table = this.splitStringToTable(str), alignments, maxLengthPerColumn;
        // table[1] = table[1].map(function (cell) {
        //     return this.padHeaderSeparatorString(cell, 0);
        // });
        table[1] = table[1].map((cell) => {
            return this.padHeaderSeparatorString(cell, 0);
        });
        this.fillInMissingColumns(table);
        alignments = table[1].map(this.getAlignment);
        maxLengthPerColumn = this.getMaxLengthPerColumn(table);
        return table.map((row, rowIndex) => {
            return '|' + row.map(function (cell, columnIndex) {
                var columnLength = maxLengthPerColumn[columnIndex];
                if (rowIndex === 1) {
                    return self.padHeaderSeparatorString(cell, columnLength + 2);
                }
                return ' ' + self.padStringWithAlignment(cell, columnLength, alignments[columnIndex]) + ' ';
            }).join('|') + '|';
        }).join('\n') + '\n';
    }
    ;
}
