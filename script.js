//컨텐트 페이지(웹 페이지)
//팝업 페이지(아이콘을 클릭했을 때 나오는 영역)


	//컨텐츠 페이지를 대상으로 코드를 실행해주세요. 
	chrome.tabs.executeScript({
		code: 'document.querySelector("body").innerText'
	  }, function (result) {
		// 위의 코드가 실행된 후에 이 함수를 호출해주세요. 그 때 result에 담아주세요. 
	 
		var regex = / /gi;

		//이 문서에서 body  태그 아래에 있는 모든 텍스트를 가져온다. 그 결과를 bodyText라는 변수에 담는다.
		var bodyText = result[0]; // 위험도 단어 들어간 약관 출력용 띄어쓰기O 텍스트 -> 원본
		var bt_com = result[0].replace(regex, ''); // 완성도 단어 필터링용 띄어쓰기X 텍스트 -> 원본에서 띄어쓰기 제거
		
		/* 약관의 완성도(구체성) 평가 */
		// 첫항목의 단어가 없으면 == s1이 0이면 이용동의가 없는 것 -> O/X 하려고 s1~s5로 따로 나눔
		// 기본 0점으로 시작하여 단어가 없는게 아니면(있으면) 20점으로

		var s1 = 0;  // 1.개인정보 수집 이용 동의서 존재 여부 점수
		var s2 = 0;  // 2.개인정보의 처리 목적 여부 점수
		var s3 = 0;  // 3.개인정보의 처리 및 보유 기간 여부 점수
		var s4 = 0;  // 4.처리하는 개인정보의 항목 여부 점수
		var s5 = 0;  // 5.주요 개인정보 처리 표시 여부 점수
		var r1 = 'O';
		var r2 = 'O';
		var r3 = 'O';
		var r4 = 'O';
		var r5 = 'O';

		if(bt_com.match(/개인정보수집및이용|개인정보이용및수집|개인정보수집·이용|개인정보수집이용|개인정보 수집\/이용|개인정보수집및서비스활용|개인정보항목수집및이용|개인정보수집동의|개인정보의수집목적및이용|개인정보수집,이용|개인정보수집처리|개인정보수집및처리|개인정보수집·처리/g) != null)
		{
			s1 = 20;
		}else{
			r1 = "X";
		}
		if(bt_com.match(/목적|이용목적|개인정보수집이용목적|개인정보수집및이용목적|수집목적|처리목적|수집및이용목적|수집·이용목적|수집•이용목적|수집\/이용 목적|개인정보의처리목적|왜그리고어떻게귀하의개인정보를이용|개인정보의수집이용목적|개인정보의수집목적및이용목적|개인정보수집목적|개인정보수집,이용목적|수집하는개인정보및이용목적|수집하는개인정보항목및이용목적|개인정보의수집및이용목적|개인정보의수집,이용목적|개인정보수집,이용항목및목적|수집하는개인정보항목,목적|수집한개인정보의이용/g) != null){
			s2 = 20;
		}else{
			r2 = "X";
		}
		if(bt_com.match(/이용기간|보관|개인정보의보유|처리및이용기간|수집및보유기간|개인정보의처리및보유기간|이용및보유기간|처리및보유기간|개인정보보유및이용기간|개인정보의보유및이용기간|개인정보이용기간및파기|개인정보보유기간|개인정보이용기간|개인정보의이용기간및파기|보유기간|보유\/이용기간|보유·이용기간|보유및이용기간/g) != null){
			s3 = 20;
		}else{
			r3 = "X";
		}
		if(bt_com.match(/항목|수집\/활용항목|수집·이용할항목|수집및이용항목|수집이용항목|개인정보의수집항목|개인정보수집항목|개인정보는무엇이고|제공정보|개인정보의항목|개인정보항목|수집하는개인정보의항목|수집항목|수집하는개인정보항목|회사가수집하는개인정보항목|회원가입시수집하는정보|수집하는개인정보의항목및수집방법|수집하는개인정보항목,목적|수집하는항목|처리하는개인정보항목|처리하는개인정보의항목|수집·이용하는개인정보의항목/g) != null){
			s4 = 20;
		}else{
			r4 = "X";
		}
		if(bt_com.match(/주민등록번호|여권번호|운전면허번호|외국인등록번호/g) == null){
			s5 = 20;  // 주민번호~ 항목들 없으면 20점
		}else{
			if(bt_com.match(/고유식별정보/g) != null) s5 = 20;  // 주민번호~ 항목 있는데 고유식별정보라는 표시가 없는게 아니면(있으면) 20점
			else r5 = "X";
		}

		var cscore = s1 + s2 + s3 + s4 + s5; // 완성도 점수

		/* 약관의 위험 단어 평가 */

		var keyLevel3 = ['주민등록번호', '여권번호', '여권 번호', '운전면허 번호', '운전면허번호', '외국인 등록번호', '외국인등록번호', '외국인 등록정보', '외국인등록정보', '신분증 사본', '신분증사본',
					'인종', '민족', '종교', '노동조합', '노동 조합', '유전', '정당', '정치', '사상', '성생활', '지문', '얼굴', '홍채', '망막', '정맥', '귓바퀴', '뇌파', '심전도',
					'음성', '필적', '걸음걸이', '자판 입력', '자판입력', '신용정보', '신용 정보', '신용카드번호', '신용카드 번호', '계좌번호', 'CVV', '카드유효기간', '직불카드',
					'신용카드 정보', '신용카드정보', '신용카드 비밀번호', '계좌 정보', '계좌정보', '위치정보', '위치 정보', '개인위치정보', '개인위치 정보', '개인 위치 정보', '개인 위치정보',
					'건강상태', '건강 상태', '진료기록', '진료 기록']; //57개(띄어쓰기한 단어도 포함)
		var keyLevel2 = ['성별', 'UDID', 'CI', '프로필이미지', '프로필 이미지', '프로필사진', '프로필 사진', '학력', '직업', ' 키', '신장', '몸무게', '체중', '혼인여부', '결혼여부', '혼인 여부',
					'결혼 여부', '결혼기념일', '결혼 기념일', '자녀 정보', '자녀정보', '취미', '관심분야', '관심 분야', '취향', '운전면허', '운전여부', '운전 여부', '병역사항', '보훈대상여부',
					'보훈대상 여부']; //31개
		var keyLevel1 = ['IP 주소', 'IP주소', 'IP Address', 'IP 정보', 'IP정보', 'MAC 주소', '사이트 방문 기록', '방문 일시', '방문일시', '서비스 방문 기록', '서비스 이용기록', '서비스 이용 기록',
					'접속 기록', '로그', '접속 로그', '쿠키', 'cookie', '기기정보',	'단말기기정보', '단말기 정보', '단말기정보', '단말기에 관한 정보', '디바이스 정보', '브라우저', 'OS', '운영체제',
					'사원증 번호', '사원 번호', '검색어', '검색기록', '위탁', '수탁', '제 3자', '제 3자에게 제공', '국외이전', '국외 이전', '전화권유판매', '전화 권유 판매', '전화권유 판매', '전화상담',
					'전화 상담', '안내권유전화', '안내 권유 전화', '안내 권유전화', '안내권유 전화', '텔레마케팅', '마케팅', '마켓팅', '광고', '맞춤형 광고', '이벤트 참여', '이벤트 개인정보',
					'맞춤식 서비스', '맞춤형 서비스', '개인 특화 서비스', '맞춤 서비스', '제휴 서비스', '제휴사', '제휴회사', 'SNS 계정', 'SNS계정']; //61개

		var keyworlds = ['주민등록번호', '여권번호', '여권 번호', '운전면허 번호', '운전면허번호', '외국인 등록번호', '외국인등록번호', '외국인 등록정보', '외국인등록정보', '신분증 사본', '신분증사본',
					'인종', '민족', '종교', '노동조합', '노동 조합', '유전', '정당', '정치', '사상', '성생활', '지문', '얼굴', '홍채', '망막', '정맥', '귓바퀴', '뇌파', '심전도',
					'음성', '필적', '걸음걸이', '자판 입력', '자판입력', '신용정보', '신용 정보', '신용카드번호', '신용카드 번호', '계좌번호', 'CVV', '카드유효기간', '직불카드', 
					'신용카드 정보', '신용카드정보', '신용카드 비밀번호', '계좌 정보', '계좌정보', '위치정보', '위치 정보', '개인위치정보', '개인위치 정보', '개인 위치 정보',
					'개인 위치정보', '건강상태', '건강 상태', '진료기록', '진료 기록', '성별', 'UDID', 'CI', '프로필이미지', '프로필 이미지', '프로필사진', '프로필 사진',
					'학력', '직업', ' 키', '신장', '몸무게', '체중', '혼인여부', '결혼여부', '혼인 여부', '결혼 여부', '결혼기념일', '결혼 기념일', '자녀 정보', '자녀정보', '취미', '관심분야',
					'관심 분야', '취향', '운전면허', '운전여부', '운전 여부', '병역사항', '보훈대상여부', '보훈대상 여부', 'IP 주소', 'IP주소', 'IP Address', 'IP 정보', 'IP정보', 'MAC 주소',
					'사이트 방문 기록', '방문 일시', '방문일시', '서비스 방문 기록', '서비스 이용기록', '서비스 이용 기록', '접속 기록', '로그', '접속 로그', '쿠키', 'cookie', '기기정보', '단말기기정보',
					'단말기 정보', '단말기정보', '단말기에 관한 정보', '디바이스 정보', '브라우저', 'OS', '운영체제', '사원증 번호', '사원 번호', '검색어', '검색기록', '위탁', '수탁', '제 3자', 
					'제 3자에게 제공', '국외이전', '국외 이전', '전화권유판매', '전화 권유 판매', '전화권유 판매', '전화상담', '전화 상담', '안내권유전화', '안내 권유 전화', '안내 권유전화',
					'안내권유 전화', '텔레마케팅', '마케팅', '마켓팅', '광고', '맞춤형 광고', '이벤트 참여', '이벤트 개인정보', '맞춤식 서비스', '맞춤형 서비스', '개인 특화 서비스', '맞춤 서비스', 
					'제휴 서비스', '제휴사', '제휴회사', 'SNS 계정', 'SNS계정']; //149
		var reasons = ['주민등록번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'여권번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'여권 번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'운전면허 번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'운전면허번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'외국인 등록번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'외국인등록번호는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'외국인 등록정보는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'외국인등록정보는 고유식별정보에 해당합니다. 약관에 이 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'신분증 사본에는 고유식별정보에 해당하는 주민등록번호가 포함되어 있기 때문에 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'신분증사본에는 고유식별정보에 해당하는 주민등록번호가 포함되어 있기 때문에 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'이 항목은 민감정보에 해당하는 인종 정보입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 민족 정보입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'고객의 종교가 사업자가 서비스를 제공하는데 필수적인 내용인지 다시 한번 확인할 필요가 있습니다.',
		'이 항목은 민감정보에 해당하는 개인 정보입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 개인 정보입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 유전 정보입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 정치적 견해입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 정치적 견해입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 정치적 견해입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 민감정보에 해당하는 성생활 정보입니다. 이용자의 사생활 침해 우려가 있어 해당 서비스를 이용하는데 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 신체정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 신체정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 신체정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 신체정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 신체정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 신체정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 생리적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 생리적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 행동적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 행동적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 행동적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 행동적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 생체정보 중 행동적 정보에 해당합니다. 이용자의 사생활 침해 우려가 있기 때문에 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 신용정보로 처리가 엄격하게 제한된 개인정보 입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 위치정보로 특정 개인의 위치정보(위치정보만으로는 특정 개인의 위치를 알 수 없는 경우에도 다른 정보와 용이하게 결합하여 특정 개인의 위치를 알 수 있는 것을 포함)를 의미합니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다',
		'이 항목은 위치정보로 특정 개인의 위치정보(위치정보만으로는 특정 개인의 위치를 알 수 없는 경우에도 다른 정보와 용이하게 결합하여 특정 개인의 위치를 알 수 있는 것을 포함)를 의미합니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다',
		'이 항목은 위치정보로 특정 개인의 위치정보(위치정보만으로는 특정 개인의 위치를 알 수 없는 경우에도 다른 정보와 용이하게 결합하여 특정 개인의 위치를 알 수 있는 것을 포함)를 의미합니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다',
		'이 항목은 위치정보로 특정 개인의 위치정보(위치정보만으로는 특정 개인의 위치를 알 수 없는 경우에도 다른 정보와 용이하게 결합하여 특정 개인의 위치를 알 수 있는 것을 포함)를 의미합니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다',
		'이 항목은 위치정보로 특정 개인의 위치정보(위치정보만으로는 특정 개인의 위치를 알 수 없는 경우에도 다른 정보와 용이하게 결합하여 특정 개인의 위치를 알 수 있는 것을 포함)를 의미합니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다',
		'이 항목은 위치정보로 특정 개인의 위치정보(위치정보만으로는 특정 개인의 위치를 알 수 없는 경우에도 다른 정보와 용이하게 결합하여 특정 개인의 위치를 알 수 있는 것을 포함)를 의미합니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다',
		'이 항목은 의료 정보로 이용자의 인권 및 사생활 보호에 중대한 피해를 야기할 수 있는 정보입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 의료 정보로 이용자의 인권 및 사생활 보호에 중대한 피해를 야기할 수 있는 정보입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 의료 정보로 이용자의 인권 및 사생활 보호에 중대한 피해를 야기할 수 있는 정보입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'이 항목은 의료 정보로 이용자의 인권 및 사생활 보호에 중대한 피해를 야기할 수 있는 정보입니다. 해당 서비스 사용 시 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'성별은 개인식별정보입니다. 약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'UDID(고유 기기 식별번호)는 개인식별정보입니다. 약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'CI(연계정보)는 개인식별정보입니다. 약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'이용자의 프로필이미지를 수집한다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'이용자의 프로필 이미지를 수집한다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'이용자의 프로필사진을 수집한다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'이용자의 프로필 사진을 수집한다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 해당 항목이 포함되어 있다면 서비스를 이용하는데 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'IP주소가 수집되어 실제 주소가 노출될 가능성이 있습니다.',
		'IP주소가 수집되어 실제 주소가 노출될 가능성이 있습니다.',
		'IP주소가 수집되어 실제 주소가 노출될 가능성이 있습니다.',
		'IP주소가 수집되어 실제 주소가 노출될 가능성이 있습니다.',
		'IP주소가 수집되어 실제 주소가 노출될 가능성이 있습니다.',
		'MAC 주소는 다른 정보와 결합하면 사용 패턴이 드러나기 때문에 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'이 항목의 분석으로 이용자의 개인정보가 분석되어 또 다른 데이터로 재생산될 가능성이 높습니다.',
		'이 항목의 분석으로 이용자의 개인정보가 분석되어 또 다른 데이터로 재생산될 가능성이 높습니다.',
		'이 항목의 분석으로 이용자의 개인정보가 분석되어 또 다른 데이터로 재생산될 가능성이 높습니다.',
		'이 항목의 분석으로 이용자의 개인정보가 분석되어 또 다른 데이터로 재생산될 가능성이 높습니다.',
		'이 항목의 분석으로 이용자의 개인정보가 분석되어 또 다른 데이터로 재생산될 가능성이 높습니다.',
		'이 항목의 분석으로 이용자의 개인정보가 분석되어 또 다른 데이터로 재생산될 가능성이 높습니다.',
		'인터넷에 접속하여 수행한 업무 내역에 대하여 계정, 접속 일시, 접속자 정보, 수행한 업무 등이 기록되어 이를 통해 맞춤형 광고 등 이용자의 개인정보가 분석될 가능성이 높습니다.',
		'인터넷에 접속하여 수행한 업무 내역에 대하여 계정, 접속 일시, 접속자 정보, 수행한 업무 등이 기록되어 이를 통해 맞춤형 광고 등 이용자의 개인정보가 분석될 가능성이 높습니다.',
		'인터넷에 접속하여 수행한 업무 내역에 대하여 계정, 접속 일시, 접속자 정보, 수행한 업무 등이 기록되어 이를 통해 맞춤형 광고 등 이용자의 개인정보가 분석될 가능성이 높습니다.',
		'쿠키를 이용해 고객의 이름, 주소, 비밀번호, 관심 분야 등 쿠키로 수반되는 다양한 개인정보 수집이 가능하므로 실제 필요한 정보인지 확인할 필요가 있습니다.',
		'쿠키를 이용해 고객의 이름, 주소, 비밀번호, 관심 분야 등 쿠키로 수반되는 다양한 개인정보 수집이 가능하므로 실제 필요한 정보인지 확인할 필요가 있습니다.',
		'PC 웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집되고 동의 없이 수집될 수 있습니다.',
		'PC 웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집되고 동의 없이 수집될 수 있습니다.',
		'PC 웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집되고 동의 없이 수집될 수 있습니다.',
		'PC 웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집되고 동의 없이 수집될 수 있습니다.',
		'PC 웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집되고 동의 없이 수집될 수 있습니다.',
		'PC 웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집되고 동의 없이 수집될 수 있습니다.',
		'약관에 이 항목이 포함되어 있다면 이용자가 사용하는 브라우저(크롬, 엣지, 웨일, 사파리 등)를 수집하는 것입니다. 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 이 항목이 포함되어 있다면 이용자의 OS(ex. 윈도우, 맥, 리눅스 등)를 수집하는 것입니다. 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'약관에 이 항목이 포함되어 있다면 이용자의 운영체제(ex. 윈도우, 맥, 리눅스 등)를 수집하는 것입니다. 꼭 필요한 정보인지 확인할 필요가 있습니다.',
		'해당 사이트를 이용할 때 이용자의 사원증 번호가 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'해당 사이트를 이용할 때 이용자의 사원 번호가 실제로 필요한 정보인지 다시 한번 확인이 필요합니다.',
		'검색어 수집을 통해 이용자의 관심 내역을 파악하여 이용자의 개인정보가 또 다른 분야에 활용될 가능성이 높습니다.',
		'검색기록 수집을 통해 이용자의 관심 내역을 파악하여 이용자의 개인정보가 또 다른 분야에 활용될 가능성이 높습니다.',
		'고객의 개인정보도 함께 이전하게 되어 개인정보가 재 유통되거나 남용될 위험이 큽니다.',
		'고객의 개인정보도 함께 이전하게 되어 개인정보가 재 유통되거나 남용될 위험이 큽니다.',
		'개인정보를 목적 외 이용 제공이 가능할 수 있습니다. 또한 제3자 제공 동의를 하지 않는 경우 불이익이 있을 수 있습니다.',
		'개인정보를 목적 외 이용 제공이 가능할 수 있습니다. 또한 제3자 제공 동의를 하지 않는 경우 불이익이 있을 수 있습니다.',
		'개인정보보호 통제권이 국외로 넘어감으로써 개인정보 유출 시 수반되는 위험 및 피해가 커질 수 있습니다.',
		'개인정보보호 통제권이 국외로 넘어감으로써 개인정보 유출 시 수반되는 위험 및 피해가 커질 수 있습니다.',
		'원치 않은 판매전화를 수신 받고 싶지 않은 경우 동의 시 다시 한번 확인이 필요합니다.',
		'원치 않은 판매전화를 수신 받고 싶지 않은 경우 동의 시 다시 한번 확인이 필요합니다.',
		'원치 않은 판매전화를 수신 받고 싶지 않은 경우 동의 시 다시 한번 확인이 필요합니다.',
		'이용자의 전화번호가 활용될 수 있습니다.', '이용자의 전화번호가 활용될 수 있습니다.', '이용자의 전화번호가 활용될 수 있습니다.', '이용자의 전화번호가 활용될 수 있습니다.',
		'이용자의 전화번호가 활용될 수 있습니다.', '이용자의 전화번호가 활용될 수 있습니다.', '이용자의 전화번호가 활용될 수 있습니다.',
		'이용자의 개인정보가 마케팅에 활용되고 이 마케팅을 위해 이용자의 개인정보가 분석될 가능성이 높습니다.',
		'이용자의 개인정보가 마케팅에 활용되고 이 마케팅을 위해 이용자의 개인정보가 분석될 가능성이 높습니다.',
		'이용자의 개인정보가 광고에 활용되고 이 광고를 위해 이용자의 개인정보가 분석될 가능성이 높습니다.',
		'이용자의 행태정보를 수집하여 이용자의 개인정보가 분석됩니다. 이는 개인정보 침해 위험성을 높입니다.',
		'이벤트 참여 혹은 경품 지급을 위하여 이름, 휴대폰 번호 등 개인정보가 처리 및 저장될 수 있고 주최 측이 개인정보를 수집하여 제휴사에게 전달하는 경우가 빈번하기 때문에 개인정보가 재 유통되거나 남용될 위험이 큽니다.',
		'이벤트 참여 혹은 경품 지급을 위하여 이름, 휴대폰 번호 등 개인정보가 처리 및 저장될 수 있고 주최 측이 개인정보를 수집하여 제휴사에게 전달하는 경우가 빈번하기 때문에 개인정보가 재 유통되거나 남용될 위험이 큽니다.',
		'맞춤식 서비스에 동의할 경우 IP, 쿠키, 방문 일시 등과 같은 정보들이 수집되어 자신의 개인정보가 별다른 동의 없이 분석되고 활용될 수 있습니다.',
		'맞춤식 서비스에 동의할 경우 IP, 쿠키, 방문 일시 등과 같은 정보들이 수집되어 자신의 개인정보가 별다른 동의 없이 분석되고 활용될 수 있습니다.',
		'맞춤식 서비스에 동의할 경우 IP, 쿠키, 방문 일시 등과 같은 정보들이 수집되어 자신의 개인정보가 별다른 동의 없이 분석되고 활용될 수 있습니다.',
		'맞춤식 서비스에 동의할 경우 IP, 쿠키, 방문 일시 등과 같은 정보들이 수집되어 자신의 개인정보가 별다른 동의 없이 분석되고 활용될 수 있습니다.',
		'서비스 제공자가 업무 제휴, 공동 마케팅 등을 위해 개인정보를 외부의 제3자에게 제공할 수 있습니다.',
		'서비스 제공자가 업무 제휴, 공동 마케팅 등을 위해 개인정보를 외부의 제3자에게 제공할 수 있습니다.',
		'서비스 제공자가 업무 제휴, 공동 마케팅 등을 위해 개인정보를 외부의 제3자에게 제공할 수 있습니다.',
		'자신의 SNS 계정을 알리는 것을 원하지 않는다면 개인정보 제공 동의를 재고해야 합니다.',
		'자신의 SNS계정을 알리는 것을 원하지 않는다면 개인정보 제공 동의를 재고해야 합니다.'];

		var kl3Text = '';
		var kl2Text = '';
		var kl1Text = '';
		var idx = '';  // 필터링할 단어의 시작 위치
		var start = 0;  // 단어가 들어있는 문장의 시작 위치 (그 문장의 앞 문장의 끝을 .으로 찾음)
		var end = 0;    // 단어가 들어있는 문장의 끝 위치 (역시 .으로 끝을 찾음)
		var dscore = 0; // 위험 단어 점수

		var n = 0;
		var popupText = '';

		for(var j = 0;j<keyworlds.length;j++){
			if(bodyText.indexOf(keyworlds[j]) != -1){ // j번째 키워드가 약관에 있다면
				popupText = popupText + "[ " + keyworlds[j] + " ]" + "\n" + reasons[j] + "\n\n";
			}
		}

		for(var i = 0;i<keyLevel3.length;i++){
			var n = 1;
			var indices = [];
			idx = bodyText.indexOf(keyLevel3[i]);
			if( idx != -1 ){
				kl3Text = kl3Text + "✔️ " + keyLevel3[i] + "\n";
				dscore = dscore - 5;
			}
			while ( idx != -1 ){
				indices.push(idx);
				idx = bodyText.indexOf(keyLevel3[i], idx+1);
			}
			  
			for(var j = 0; j < indices.length; j++){
				start = bodyText.lastIndexOf(".", indices[j]);
				end = bodyText.indexOf(".", start+1);
				  
				kl3Text = kl3Text + n + " ========" + "\n" + bodyText.substring(start+1, end+1) + "\n\n";
				n = n + 1;
			}
		}
		for(var i = 0;i<keyLevel2.length;i++){
			var n = 1;
			var indices = [];
			idx = bodyText.indexOf(keyLevel2[i]);
			if( idx != -1 ){
				kl2Text = kl2Text + "✔️ " + keyLevel2[i] + "\n";
				dscore = dscore - 3;
			}
			while ( idx != -1 ){
				indices.push(idx);
				idx = bodyText.indexOf(keyLevel2[i], idx+1);
			}
			  
			for(var j = 0; j < indices.length; j++){
				start = bodyText.lastIndexOf(".", indices[j]);
				end = bodyText.indexOf(".", start+1);
				  
				kl2Text = kl2Text + n + " ========" + "\n" + bodyText.substring(start+1, end+1) + "\n\n";
				n = n + 1;
			}
		}
		for(var i = 0;i<keyLevel1.length;i++){
			var n = 1;
			var indices = [];
			idx = bodyText.indexOf(keyLevel1[i]);
			if( idx != -1 ){
				kl1Text = kl1Text + "✔️ " + keyLevel1[i] + "\n";
				dscore = dscore - 1;
			}
			while ( idx != -1 ){
				indices.push(idx);
				idx = bodyText.indexOf(keyLevel1[i], idx+1);
			}
			  
			for(var j = 0; j < indices.length; j++){
				start = bodyText.lastIndexOf(".", indices[j]);
				end = bodyText.indexOf(".", start+1);
				  
				kl1Text = kl1Text + n + " ========" + "\n" + bodyText.substring(start+1, end+1) + "\n\n";
				n = n + 1;
			}
		}

		var score = cscore + dscore;
		
		if(score<=30) {
			document.getElementById("circle").style.borderColor = "#EB274C";
		}
		else if(score<=70) {
			document.getElementById("circle").style.borderColor = "#FFC041";
		}
		else {
			document.getElementById("circle").style.borderColor = "#4CD964";
		}

		// id값이 result인 태그에 결과를 추가한다. 
		document.querySelector('#circle').innerText = score;
		
		document.getElementById("table1").getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML = r1;
		document.getElementById("table1").getElementsByTagName("tr")[1].getElementsByTagName("td")[1].innerHTML = r2;
		document.getElementById("table1").getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML = r3;
		document.getElementById("table1").getElementsByTagName("tr")[3].getElementsByTagName("td")[1].innerHTML = r4;
		document.getElementById("table1").getElementsByTagName("tr")[4].getElementsByTagName("td")[1].innerHTML = r5;

		document.querySelector('#cont4').innerText = popupText;

		document.addEventListener("DOMContentLoaded", function(){
			var btn = document.getElementById("btn");
			btn.addEventListener("click", function(){
				window.open('next.html');
			});
		});

		localStorage.setItem('keyText', kl3Text + "\n" + kl2Text + "\n" + kl1Text + "\n");
		localStorage.setItem('s1',s1);
		localStorage.setItem('s2',s2);
		localStorage.setItem('s3',s3);
		localStorage.setItem('s4',s4);
		localStorage.setItem('s5',s5);
		localStorage.setItem('score', score);
		localStorage.setItem('cscore', cscore);
		localStorage.setItem('dscore', -(dscore));

	  });