var attributes = {
    length: 0,
    vectorB: [],
    coefficients: [{}],
    answers: []
}

var components = {
    dimensao: document.getElementById("dimensao"),
    elemMatrix: document.getElementById("elementos_cx"),
    calculate: "",
    matrix: "",
    contentResp: document.getElementById("resp")
}

function toUpperTriangular() {
    let M = [{}];
    M = Object.assign(M, attributes.coefficients);
    let n = attributes.coefficients.length;
    let np = attributes.coefficients[0].length;
    let p;

    for (let i = 0; i < n; i++) {
        if (M[i][i] == 0) {
            for (let k = i + 1; k < n; k++) {
                if (M[k][i] != 0) {
                    let els = [];
                    for (p = 0; p < np; p++) {
                        els.push(M[i][p] + M[k][p]);
                    }
                    attributes.vectorB[i] = attributes.vectorB[i] + attributes.vectorB[k]
                    M[i] = els;
                    break;
                }
            }
        } else {
            for (let j = i + 1; j < n; j++) {
                let multiplier = M[j][i] / M[i][i];
                els = [];
                for (p = 0; p < np; p++) {
                    els.push(p <= i ? 0 :
                        Number.isInteger(M[j][p] - M[i][p] * multiplier) ?
                            (M[j][p] - M[i][p] * multiplier) :
                            (M[j][p] - M[i][p] * multiplier).toFixed(3));
                }
                attributes.vectorB[j] = Number.isInteger(attributes.vectorB[j] - attributes.vectorB[i] * multiplier) ?
                    (attributes.vectorB[j] - attributes.vectorB[i] * multiplier) :
                    (attributes.vectorB[j] - attributes.vectorB[i] * multiplier).toFixed(3);
                M[j] = els;
            }
        }
    }

    attributes.coefficients = M;
    return M;
}

function calculateDeterminant(m) {
    let det = m[0][0];
    let n = attributes.length;
    for (var i = 1; i < n; i++) {
        det = det * m[i][i];
    }

    return det;
}

function printMatrix() {
    let row = '';

    for (let i = 0; i < attributes.length; i++) {
        for (let j = 0; j <= attributes.length; j++) {
            if (j == attributes.length) {
                row += `= ${attributes.vectorB[i]} \n`;
            } else {
                row += `${attributes.coefficients[i][j]} `;
            }
        }
    }

    components.contentResp.innerText = row;
}

function anteriores(i) {
    let soma = 0;
    let j = attributes.length - 1;
    for (let k = attributes.length - 1; k >= 0; k--, j--) {
        soma += attributes.coefficients[i][j] * attributes.answers[k];
    }
    return soma;
}

function solveSystem() {
    for (let i = 0; i < attributes.length; i++) {
        attributes.answers[i] = 0;
    }

    let j = attributes.length - 1;

    for (let i = attributes.length - 1; i >= 0; i--, j--) {
        attributes.answers[j] = Number.isInteger(((attributes.vectorB[j] - anteriores(i)) / attributes.coefficients[i][j])) ?
            ((attributes.vectorB[j] - anteriores(i)) / attributes.coefficients[i][j]) :
            ((attributes.vectorB[j] - anteriores(i)) / attributes.coefficients[i][j]).toFixed(3);
    }

    let xs = '';
    for (let i = 0; i < attributes.length; i++) {
        xs += `X${i + 1} = ${attributes.answers[i]} \n`;
    }

    let values = document.createElement("p");
    values.innerText = xs;

    components.contentResp.appendChild(values);
}

function clearAttributes() {
    attributes.vectorB = [];
    attributes.coefficients = [{}];
    attributes.length = 0;
}

function calculateSystem(m) {
    components.contentResp.style.display = 'block';
    attributes.answers = new Array(Number(components.dimensao.value),);

    m = toUpperTriangular();

    if (calculateDeterminant(m) == 0) {
        printMatrix();
        components.contentResp.innerText = "Matriz singular! \n Não possui solução!"
    } else {
        printMatrix();
        solveSystem();
    }

    clearAttributes();
}

function getElements() {
    attributes.vectorB = [attributes.length];
    let columns = [];
    let column = [];

    let rows = document.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        columns = rows[i].getElementsByTagName("td");
        for (let j = 0; j < columns.length; j++) {
            if (j == columns.length - 1) {
                attributes.vectorB.push(Number(columns[j].getElementsByTagName("input")[0].value));
            } else {
                column.push(Number(columns[j].getElementsByTagName("input")[0].value));
            }
        }
        attributes.coefficients.push(column);
        column = [];
    }

    attributes.coefficients.shift();
    attributes.vectorB.shift();

    calculateSystem(attributes.coefficients);
}

function createFields(tam) {
    components.contentResp.style.display = 'none';

    if (components.elemMatrix.hasChildNodes) {
        while (components.elemMatrix.firstChild) {
            components.elemMatrix.removeChild(components.elemMatrix.lastChild);
        }
    }

    attributes.length = tam;
    let matrix = document.createElement("table");

    // create header table
    let head = [tam + 1];

    for (let i = 0; i < tam; i++) {
        head[i] = `X${i + 1}`;
    }

    head[head.length] = "B";

    let mHead = document.createElement("thead");
    let mHeadRow = document.createElement("tr");

    head.forEach(element => {
        let xs = document.createElement("th");
        xs.innerText = element;
        mHeadRow.appendChild(xs);
    });

    mHead.appendChild(mHeadRow);
    matrix.appendChild(mHead);

    // Create rows
    for (let i = 0; i < tam; i++) {
        let mRow = document.createElement("tr");
        for (let j = 0; j <= tam; j++) {
            let mColumn = document.createElement("td");
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("class", "element");
            mColumn.appendChild(input);
            mRow.appendChild(mColumn);
        }
        matrix.appendChild(mRow);
    }

    components.elemMatrix.appendChild(matrix)

    let calculate = document.getElementById("btnCalculate");

    if (typeof (calculate) == 'undefined' || calculate == null) {
        calculate = document.createElement("button");
        calculate.innerText = "Calcular";
        calculate.setAttribute("class", "btn");
        components.elemMatrix.appendChild(calculate);
        components.calculate = calculate;
        calculate.addEventListener("click", () => {
            getElements();
        })
    }

    components.matrix = matrix;
}

window.addEventListener("load", function (e) {
    components.dimensao.focus();

    components.dimensao.addEventListener("blur", () => createFields(Number(components.dimensao.value)));
    components.dimensao.addEventListener("keypress", function (t) {
        let tecla = t.which || t.keyCode;

        if (tecla == 13) {
            components.dimensao.blur();
        }
    })
})