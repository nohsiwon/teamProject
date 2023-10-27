// 시간을 표시하는 함수
const elapsedTime = (date) => {
  date = new Date(date);
  if (!(date instanceof Date) || isNaN(date)) {
    return '작성 시간 미정'; // 날짜가 유효하지 않으면 특별한 문자열 반환
  }

  const start = new Date(date);
  const end = new Date();

  const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (seconds < 60) return '방금 전';

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;

  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;

  return start.toLocaleDateString();
};

let cnt = 1; // 글번호로 할당

// URL에서 movieId 가져오기

console.log(movieId);

/* 작성 ----------------------------------------------------------*/
function writing() {
  console.log(movieId);

  let writer = f.writer.value.trim();
  let pwd = f.pwd.value.trim();
  let content = f.content.value;
  let star = f.star.value;
  let errorDiv = document.getElementById('error');

  // 작성자, 글 비밀번호, 내용, 별점선택 유효성검사
  if (writer.length < 2) {
    errorDiv.textContent = '작성자는 두 글자 이상 입력해주세요.';
    return;
  }
  if (pwd.length < 4) {
    errorDiv.textContent = '글 비밀번호는 네 자리 이상 입력해주세요.';
    return;
  }
  if (content.length < 2) {
    errorDiv.textContent = '내용은 두 글자 이상 입력해주세요.';
    return;
  }
  if (star === '별점선택') {
    errorDiv.textContent = '별점을 선택해주세요.';
    return;
  }

  // 오류 메시지 지우기
  errorDiv.textContent = '';


  // 현재 시간을 가져오기
  const timestamp = new Date(); // 현재 시간으로 설정

  // Rest of your code to create the review and save to local storage
  let el = makeDiv(writer, pwd, content, star, new Date());

  let list = document.getElementById('list');
  list.appendChild(el);

  // 글 작성 완료되면 입력폼 초기화
  f.writer.value = '';
  f.pwd.value = '';
  f.content.value = '';
  f.star.value = '별점선택';

  // 글 작성이 완료된 후 글 내용을 로컬 스토리지에 저장
  saveToLocalStorage(writer, pwd, content, star, timestamp); // 시간 정보를 저장
}

/* 글<div> 생성 ----------------------------------------------------*/
function makeDiv(writer, pwd, content, star, timestamp) {
  /*-- 1. <div id="d_1" pwd='1111'></div> ------------------------*/
  let newDiv = document.createElement('div'); // 새 <div> 태그 생성
  newDiv.classList = 'commentBox';
  newDiv.id = 'd_' + cnt; // 생성한 div에 id 지정. d_1, d_2 ...
  newDiv.pwd = pwd; // 사용자가 입력한 pwd값을 파라미터로 받아 할당.
  const timeAgo = elapsedTime(timestamp); // 작성 시간을 계산

  //   <div class="commentUserBox">
  //   <div class="commentUser">
  //     <div id='w_${cnt}'>${writer}</div>
  //     <div id='s_${cnt}'>${star}</div>
  //   </div>
  //   <div class="comments">
  //     <div id='c_${cnt}'>${content}</div>
  //     <div class='buttonBox'>
  //       <div onclick=editForm(${cnt})>수정</div>
  //       <div onclick=del(${cnt})>삭제</div>
  //     </div>
  //   </div>
  // </div>
  /*-- 2. <div>태그의 innerHTML 값 넣어주기 --------------------------*/

  let html = '';
  html += `작성 시간:<span id='time_${cnt}'>${timeAgo}</span><br/>`;
  html += "작성자:<span id='w_" + cnt + "'>" + writer + '</span><br/>';
  html += "내용:<span id='c_" + cnt + "'>" + content + '</span><br/>';
  html += "별점:<span id='s_" + cnt + "'>" + star + '</span><br/>';
  html += "<input type='button' value='수정' onclick=editForm(" + cnt + ')>';
  html += "<input type='button' value='삭제' onclick=del(" + cnt + ')>';

  let html = `
 

  <div class="commentUserBox2">
    <div class='commentUser'>
        <div id='s_${cnt}'>${star}</div>
        <div class='comment2' id='c_${cnt}'>${content}</div>
        <div class='user' id='w_${cnt}'>${writer}</div>
      </div>
      <div class='buttonBox'>
        <div class='BtnStyle' onclick=editForm(${cnt})>수정</div>
        <div class='BtnStyle' onclick=del(${cnt})>삭제</div>
      </div>
  </div>
  
  newDiv.innerHTML = html;
  cnt++;
  return newDiv;
}

/* 작성한 글을 로컬 스토리지에 저장 */
function saveToLocalStorage(writer, pwd, content, star, timestamp) {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  let post = {
    writer: writer,
    pwd: pwd,
    content: content,
    star: star,
    movieId: movieId, // 영화 ID 추가
    timestamp: new Date(),
  };
  posts.push(post);
  localStorage.setItem('posts', JSON.stringify(posts));
}

/* 페이지 로드 시 로컬 스토리지에서 글을 불러와 목록에 표시 */
window.onload = function () {
  loadFromLocalStorage();
};

function loadFromLocalStorage() {
  let list = document.getElementById('list');
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  list.innerHTML = ''; // 기존 목록을 초기화

  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    // 영화 ID에 따라 필터링
    if (post.movieId === movieId) {
      console.log('시간', post.timestamp);
      let el = makeDiv(post.writer, post.pwd, post.content, post.star, post.timestamp);
      list.appendChild(el);
    }
  }
}

/* 1-1. 수정 폼 보여주기 (이전에 작성한 내용과 함께) ------------------------*/
function editForm(cnt) {
  let editDiv = document.getElementById('d_' + cnt); // 수정할 글의 div
  let editForm = document.getElementById('editf'); // 수정폼 div

  // 수정할 글(부모요소)에 수정폼(자식요소)을 추가하기
  editDiv.appendChild(editForm);

  // <span></span> 사잇값을 변수에 담기
  let writer = document.getElementById('w_' + cnt).innerHTML;
  let content = document.getElementById('c_' + cnt).innerHTML;
  let star = document.getElementById('s_' + cnt).innerHTML;

  // 수정폼에 사잇값 담기
  document.getElementById('editwriter').value = writer;
  document.getElementById('editcontent').value = content;
  document.getElementById('editstar').value = star;

  // 버튼에 cnt 속성을 추가해서 수정 글번호를 저장
  document.getElementById('editbtn').cnt = cnt;

  // 0.03초후에 클래스 추가/제거로 애니메이션효과 추가
  setTimeout(() => {
    editForm.classList.toggle('editf');
  }, 30);
}

/* 1-2. 수정 완료하기 -----------------------------------------------*/
function edit() {
  let cnt = document.getElementById('editbtn').cnt; // 수정할 글의 번호
  let editDiv = document.getElementById('d_' + cnt); // 수정할 글의 div
  let pwd2 = document.getElementById('editpwd').value; // 수정폼에 입력한 글 비밀번호

  if (editDiv.pwd != pwd2) {
    // 원 글 비번과 수정폼 비번 비교
    alert('글 비밀번호 불일치. 수정 불가');
  } else {
    let newWriter = document.getElementById('editwriter').value;
    let newcontent = document.getElementById('editcontent').value;
    let newstar = document.getElementById('editstar').value;

    // 폼에 작성한 내용을 글 div에 담기
    document.getElementById('w_' + cnt).innerHTML = newWriter;
    document.getElementById('c_' + cnt).innerHTML = newcontent;
    document.getElementById('s_' + cnt).innerHTML = newstar;

    // 로컬 스토리지에서도 수정된 내용을 업데이트
    updateLocalStorage(cnt, newWriter, newcontent, newstar);
  }

  // 입력폼 초기화
  document.getElementById('editwriter').value = '';
  document.getElementById('editpwd').value = '';
  document.getElementById('editcontent').value = '';
  document.getElementById('editstar').value = '별점선택'; // 초기값으로 설정

  // 폼 숨기기
  cancel();
}

/* 수정된 내용을 로컬 스토리지에 업데이트 */
function updateLocalStorage(cnt, newWriter, newcontent, newstar) {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  if (cnt > 0 && cnt <= posts.length) {
    posts[cnt - 1].writer = newWriter;
    posts[cnt - 1].content = newcontent;
    posts[cnt - 1].star = newstar;
    localStorage.setItem('posts', JSON.stringify(posts));
  }
}

/* 1-3. 수정 취소하기 ----------------------------------------------*/
function cancel() {
  let editForm = document.getElementById('editf'); // 수정폼div를 변수에 담기
  editForm.style.display = 'none'; // 화면에 사라지게 하고 자리 뺌
  // 수정글에 붙여놓은 수정폼을 다시 <body>로 돌려놓음 (원래 자리)
  document.getElementsByTagName('body')[0].appendChild(editForm);
}

/* 2. 삭제 -------------------------------------------------------*/
function del(cnt) {
  let pwd = prompt('글 비밀번호');
  let delDiv = document.getElementById('d_' + cnt);
  if (pwd == delDiv.pwd) {
    // <div id = "list"> <delDiv> </div>
    document.getElementById('list').removeChild(delDiv);
    // 로컬 스토리지에서도 삭제
    deleteFromLocalStorage(cnt);
  } else {
    alert('글 비밀번호 불일치. 삭제 취소');
  }
}

/* 글 삭제 시 로컬 스토리지에서 삭제 */
function deleteFromLocalStorage(cnt) {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  // 해당 글번호를 가진 글 삭제
  posts = posts.filter((post, index) => index !== cnt - 1);
  localStorage.setItem('posts', JSON.stringify(posts));
}
