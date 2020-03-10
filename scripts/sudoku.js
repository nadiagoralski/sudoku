var boardData = [
   -1,  1, -1, -1, -1, -1, -1,  9, -1,
   -1, -1,  4, -1, -1, -1,  2, -1, -1,
   -1, -1,  8, -1, -1,  5, -1, -1, -1,
   -1, -1, -1, -1, -1, -1, -1,  3, -1,
    2, -1, -1, -1,  4, -1,  1, -1, -1,
   -1, -1, -1, -1, -1, -1, -1, -1, -1,
   -1, -1,  1,  8, -1, -1,  6, -1, -1,
   -1,  3, -1, -1, -1, -1, -1,  8, -1,
   -1, -1,  6, -1, -1, -1, -1, -1, -1
];
let board;
let cols;
let valid = true;
//let moves = [];
let boards = [];
let palette;
let selected;
let rows = [];


function sameBlock(x1, y1, x2, y2) {
   let firstRow = Math.floor(y1 / 3) * 3;
   let firstCol = Math.floor(x1 / 3) * 3;
   return (y2 >= firstRow && y2 <= (firstRow + 2) && x2 >= firstCol && x2 <= (firstCol + 2));
}

function sameRow(x1, y1, x2, y2) {
   return y1 == y2;
}

function sameColumn(x1, y1, x2, y2) {
   return x1 == x2;
}

function overlaps(x1, y1, x2, y2) {
   return sameBlock(x1, y1, x2, y2) || sameRow(x1, y1, x2, y2) || sameColumn(x1, y1, x2, y2);
}

function addToBoard() {
   boards.push($("#board").html());
   let td = $(this);
   let id = td.attr('id');
   let x = parseInt(id.split('_')[0]);
   let y = parseInt(id.split('_')[1]);
   // let x = parseInt(td.attr('x'));
   // let y = parseInt(td.attr('y'));

   if (selected != null && td.first('span').text() === '') {
      // if (!valid) {q
      //    alert("Please correct error");
      //    return false;
      // }
      let span = document.createElement('span');

      validate(x, y);
      if (!valid) {
         span.className = 'error';
      }

      span.textContent = selected;
      td.html(span);

      //moves.push([x, y]);
   } else {
      $("#noSelectionError").show();
   }
}

function boardPosition(x, y) {
   return y * 9 + x;
}

function undo() {
   // let lastMove = moves.pop()
   // if (lastMove) {
   if (boards.length > 0) {
      // let x = lastMove[0];
      // let y = lastMove[1];

      //$('#' + x + '_' + y +' span').empty();
      $("#board").html(boards.pop());
      $('#board td').click(addToBoard);
   }
}

function validate(x, y) {
   valid = true;
   $("span:contains('" + selected + "')").each(function () {
      let td2 = $(this).parent();
      let x2 = parseInt($(this).parent().attr('id').split('_')[0]);
      let y2 = parseInt($(this).parent().attr('id').split('_')[1])


      if (overlaps(x, y, x2, y2)) {
         td2.addClass('error');
         valid = false;
      }
   });
}

$(document).ready(function() {
   // init globals
   board = $('#board');
   cols = $('#board tr td');
   palette = $('#palette');
   rows = $('#board tr');

   // generate board
   for(let i = 0, td, tr, val; i < 9; i++){
      tr = document.createElement('tr');

      for (let j = 0; j < 9; j++) {
         val = boardData[boardPosition(j, i)];
         td = document.createElement('td');
         td.id = j + '_' + i;
         // td.id = (j + 1) + '_' + (i + 1);

         let span = document.createElement('span');
         if (val > 0) {
            span.append(val);
            td.className = 'disabled';
         }

         td.append(span);
         // td.append(val === -1 ? ' ' : val);
         tr.append(td);
      }

      board.append(tr);
      palette.append('<li>' + (i + 1) + '</li>');
   }

   $( "<div id=\"noSelectionError\" class=\"error-text\" style=\"display: none\">\n" +
       "       Please select a number below to add to the board\n" +
       "   </div>" ).insertBefore( "#palette" );
   palette.append('<li id="undo" onclick="undo()"><img src="./images/undo.png" /></li>');

   // init clicks
   $('#board td').click(addToBoard);

   $('#palette li:not(#undo)').click(function (e) {
      let isSelected = $(this).hasClass('selected');

      $(".selected").removeClass('selected');

      if (isSelected) {
         selected = null;
      } else {
         $(this).addClass('selected');
         selected = $(this).text();
         $("#noSelectionError").hide();
      }

      console.log(selected);
   });
});
