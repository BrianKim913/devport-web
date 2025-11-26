import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-2">개인정보 처리방침</h1>
          <p className="text-gray-400">최종 수정일: 2025년 1월 26일</p>
        </div>

        {/* Content */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-gray-700 space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="leading-relaxed mb-3">
              devport.kr (이하 "서비스")는 다음의 목적을 위해 개인정보를 수집하고 이용합니다:
            </p>
            <div className="bg-[#0f1117] p-4 rounded-lg space-y-2">
              <p><strong className="text-white">가. 회원 관리</strong></p>
              <p className="ml-4">- 회원제 서비스 제공, 개인 식별, 불량회원의 부정 이용 방지</p>

              <p><strong className="text-white">나. 서비스 제공</strong></p>
              <p className="ml-4">- 맞춤형 콘텐츠 추천, 서비스 이용 기록 관리</p>

              <p><strong className="text-white">다. 마케팅 및 광고 활용</strong></p>
              <p className="ml-4">- 이벤트 정보 제공, 서비스 개선을 위한 통계 분석 (선택사항)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. 수집하는 개인정보 항목</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">가. OAuth 로그인 시 수집 정보</h3>
                <div className="bg-[#0f1117] p-4 rounded-lg space-y-2">
                  <p><strong className="text-blue-400">GitHub OAuth:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>이메일 주소</li>
                    <li>이름 (GitHub username)</li>
                    <li>프로필 이미지</li>
                    <li>GitHub 고유 ID</li>
                  </ul>

                  <p className="mt-3"><strong className="text-blue-400">Google OAuth:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>이메일 주소</li>
                    <li>이름</li>
                    <li>프로필 이미지</li>
                    <li>Google 고유 ID</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">나. 자동으로 수집되는 정보</h3>
                <div className="bg-[#0f1117] p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li>서비스 이용 기록</li>
                    <li>접속 로그</li>
                    <li>쿠키 정보</li>
                    <li>접속 IP 주소</li>
                    <li>기기 정보 (브라우저 종류, OS 등)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">가. 회원 정보</strong>
              </p>
              <p className="ml-4">
                - 회원 탈퇴 시까지 보유 및 이용<br />
                - 탈퇴 즉시 모든 개인정보 삭제 (법령에서 보존 의무를 부과한 경우 제외)
              </p>

              <p className="leading-relaxed">
                <strong className="text-white">나. 법령에 따른 보존</strong>
              </p>
              <div className="ml-4 bg-[#0f1117] p-4 rounded-lg space-y-1">
                <p>- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</p>
                <p>- 소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</p>
                <p>- 접속 로그 기록: 3개월 (통신비밀보호법)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. 개인정보의 제3자 제공</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              </p>
              <p className="leading-relaxed">
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. 개인정보 처리 위탁</h2>
            <p className="leading-relaxed mb-3">
              서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다:
            </p>
            <div className="bg-[#0f1117] p-4 rounded-lg space-y-2">
              <p><strong className="text-white">가. AWS (Amazon Web Services)</strong></p>
              <p className="ml-4">- 위탁 업무: 클라우드 서버 호스팅, 데이터 저장</p>
              <p className="ml-4">- 보유 기간: 회원 탈퇴 시 또는 위탁 계약 종료 시까지</p>

              <p className="mt-3"><strong className="text-white">나. Google Analytics (선택사항)</strong></p>
              <p className="ml-4">- 위탁 업무: 서비스 이용 통계 분석</p>
              <p className="ml-4">- 보유 기간: 수집 후 26개월</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. 이용자의 권리와 행사 방법</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-white">개인정보 열람 요구</strong></li>
                <li><strong className="text-white">개인정보 정정 요구</strong></li>
                <li><strong className="text-white">개인정보 삭제 요구</strong></li>
                <li><strong className="text-white">개인정보 처리 정지 요구</strong></li>
              </ul>
              <p className="leading-relaxed mt-3">
                권리 행사는 이메일(contact@devport.kr)을 통해 요청하실 수 있으며,
                서비스는 지체 없이 조치하겠습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. 개인정보의 파기 절차 및 방법</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">가. 파기 절차</strong>
              </p>
              <p className="ml-4">
                회원 탈퇴 시 개인정보는 즉시 파기됩니다.<br />
                법령에 따라 보존해야 하는 정보는 별도의 DB로 옮겨져 일정 기간 저장된 후 파기됩니다.
              </p>

              <p className="leading-relaxed">
                <strong className="text-white">나. 파기 방법</strong>
              </p>
              <p className="ml-4">
                - 전자적 파일: 복구 및 재생이 불가능한 방법으로 영구 삭제<br />
                - 종이 문서: 분쇄기로 분쇄하거나 소각
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. 개인정보 보호를 위한 기술적/관리적 대책</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">가. 기술적 대책</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>개인정보 암호화 (HTTPS/SSL 적용)</li>
                <li>해킹 등에 대비한 보안 프로그램 설치 및 주기적 업데이트</li>
                <li>접근 제한을 통한 개인정보 보호</li>
              </ul>

              <p className="leading-relaxed mt-3">
                <strong className="text-white">나. 관리적 대책</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>개인정보 취급 담당자의 최소화 및 교육</li>
                <li>개인정보 보호 관련 내부 관리계획 수립 및 시행</li>
                <li>접근 기록의 보관 및 위변조 방지</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. 쿠키(Cookie)의 운용</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">가. 쿠키의 사용 목적</strong>
              </p>
              <p className="ml-4">
                서비스는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다.<br />
                쿠키는 로그인 상태 유지, 사용자 선호 설정 저장 등에 사용됩니다.
              </p>

              <p className="leading-relaxed">
                <strong className="text-white">나. 쿠키의 설치/운용 및 거부</strong>
              </p>
              <p className="ml-4">
                이용자는 브라우저 설정을 통해 쿠키 허용 여부를 선택할 수 있습니다.<br />
                다만, 쿠키 설치를 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. 개인정보 보호책임자</h2>
            <p className="leading-relaxed mb-3">
              개인정보 관련 문의, 불만처리, 피해구제 등에 관한 사항은 아래의 개인정보 보호책임자에게 문의하시기 바랍니다:
            </p>
            <div className="bg-[#0f1117] p-4 rounded-lg">
              <p className="text-white"><strong>개인정보 보호책임자</strong></p>
              <p className="mt-2">이메일: privacy@devport.kr</p>
              <p>연락처: contact@devport.kr</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. 권익침해 구제 방법</h2>
            <p className="leading-relaxed mb-3">
              개인정보 침해로 인한 신고나 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다:
            </p>
            <div className="bg-[#0f1117] p-4 rounded-lg space-y-2">
              <p><strong className="text-white">개인정보 침해신고센터</strong></p>
              <p className="ml-4">- 전화: (국번없이) 118</p>
              <p className="ml-4">- 홈페이지: privacy.kisa.or.kr</p>

              <p className="mt-3"><strong className="text-white">개인정보 분쟁조정위원회</strong></p>
              <p className="ml-4">- 전화: (국번없이) 1833-6972</p>
              <p className="ml-4">- 홈페이지: www.kopico.go.kr</p>

              <p className="mt-3"><strong className="text-white">대검찰청 사이버범죄수사단</strong></p>
              <p className="ml-4">- 전화: 02-3480-3573</p>
              <p className="ml-4">- 홈페이지: www.spo.go.kr</p>

              <p className="mt-3"><strong className="text-white">경찰청 사이버안전국</strong></p>
              <p className="ml-4">- 전화: (국번없이) 182</p>
              <p className="ml-4">- 홈페이지: cyberbureau.police.go.kr</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. 개인정보 처리방침의 변경</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                이 개인정보 처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는
                변경사항의 시행 7일 전부터 서비스의 공지사항을 통하여 고지할 것입니다.
              </p>
              <p className="leading-relaxed">
                단, 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
              </p>
            </div>
          </section>

          <div className="border-t border-gray-700 pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              본 방침은 2025년 1월 26일부터 시행됩니다.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/terms"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← 이용약관 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
