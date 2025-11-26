import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-2">이용약관</h1>
          <p className="text-gray-400">최종 수정일: 2025년 1월 26일</p>
        </div>

        {/* Content */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-gray-700 space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제1조 (목적)</h2>
            <p className="leading-relaxed">
              이 약관은 devport.kr (이하 "서비스")가 제공하는 개발자 트렌드 정보 서비스의 이용과 관련하여
              서비스와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제2조 (정의)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">1. "서비스"</strong>란 devport.kr에서 제공하는 개발자 관련 트렌드 정보,
                뉴스 큐레이션, LLM 랭킹 정보 등 모든 서비스를 의미합니다.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">2. "이용자"</strong>란 본 약관에 따라 서비스를 이용하는 회원 및
                비회원을 말합니다.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">3. "회원"</strong>이란 서비스에 접속하여 본 약관에 따라
                회원가입(OAuth 로그인)을 하여 서비스를 이용하는 이용자를 말합니다.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">4. "콘텐츠"</strong>란 서비스에서 제공되는 모든 정보, 기사,
                데이터, 이미지 등을 의미합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제3조 (약관의 효력 및 변경)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.
              </p>
              <p className="leading-relaxed">
                2. 서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며,
                약관이 변경된 경우에는 서비스 공지사항을 통해 공지합니다.
              </p>
              <p className="leading-relaxed">
                3. 변경된 약관은 공지된 날로부터 7일 후부터 효력이 발생합니다.
                이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제4조 (회원가입 및 탈퇴)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                1. 이용자는 GitHub 또는 Google OAuth를 통해 회원가입을 할 수 있습니다.
              </p>
              <p className="leading-relaxed">
                2. 회원가입 시 제공된 정보는 서비스 제공을 위해서만 사용됩니다.
              </p>
              <p className="leading-relaxed">
                3. 회원은 언제든지 탈퇴를 요청할 수 있으며, 탈퇴 시 개인정보는 즉시 삭제됩니다.
              </p>
              <p className="leading-relaxed">
                4. 서비스는 다음 각 호에 해당하는 경우 회원자격을 제한 또는 정지시킬 수 있습니다:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>타인의 정보를 도용한 경우</li>
                <li>서비스 운영을 고의로 방해한 경우</li>
                <li>관련 법령 또는 본 약관을 위반한 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제5조 (서비스 제공)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                1. 서비스는 다음 각 호의 서비스를 제공합니다:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>개발자 트렌드 뉴스 및 기사 큐레이션</li>
                <li>GitHub 트렌딩 리포지토리 정보</li>
                <li>LLM 모델 성능 비교 및 랭킹</li>
                <li>기타 개발자 커뮤니티 관련 정보</li>
              </ul>
              <p className="leading-relaxed">
                2. 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.
                다만, 시스템 점검, 서버 장애 등의 사유로 서비스가 일시 중단될 수 있습니다.
              </p>
              <p className="leading-relaxed">
                3. 서비스의 내용, 운영 방법 등은 사전 공지 후 변경될 수 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제6조 (콘텐츠 저작권)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                1. 서비스에서 제공하는 콘텐츠는 각 원저작자에게 저작권이 있으며,
                서비스는 이를 큐레이션하여 제공합니다.
              </p>
              <p className="leading-relaxed">
                2. 이용자는 서비스에서 제공하는 콘텐츠를 개인적인 용도로만 사용할 수 있으며,
                상업적 용도로 사용할 수 없습니다.
              </p>
              <p className="leading-relaxed">
                3. 서비스에서 생성된 한국어 요약, UI/UX 등의 2차적 저작물에 대한
                저작권은 devport.kr에 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제7조 (이용자의 의무)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                이용자는 다음 각 호의 행위를 해서는 안 됩니다:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>타인의 정보 도용</li>
                <li>서비스 운영 방해 행위</li>
                <li>서비스의 콘텐츠를 무단으로 복제, 배포, 판매하는 행위</li>
                <li>자동화된 수단(크롤링, 스크래핑 등)을 통한 무단 데이터 수집</li>
                <li>관련 법령을 위반하는 행위</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제8조 (서비스의 면책)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                1. 서비스는 천재지변, 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
              </p>
              <p className="leading-relaxed">
                2. 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
              </p>
              <p className="leading-relaxed">
                3. 서비스에서 제공하는 콘텐츠의 정확성, 신뢰성에 대해서는 보증하지 않으며,
                이로 인해 발생한 손해에 대해 책임을 지지 않습니다.
              </p>
              <p className="leading-relaxed">
                4. 외부 링크를 통해 연결된 제3자의 웹사이트에서 발생한 문제에 대해서는 책임을 지지 않습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제9조 (분쟁 해결)</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                1. 서비스와 이용자 간 발생한 분쟁에 관한 소송은 대한민국 법률을 준거법으로 합니다.
              </p>
              <p className="leading-relaxed">
                2. 서비스와 이용자 간 발생한 분쟁에 대해서는 대한민국 서울중앙지방법원을
                전속 관할 법원으로 합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">제10조 (문의)</h2>
            <p className="leading-relaxed">
              본 약관과 관련하여 문의사항이 있으신 경우 아래로 연락 주시기 바랍니다:
            </p>
            <div className="bg-[#0f1117] p-4 rounded-lg mt-4">
              <p className="text-white">이메일: contact@devport.kr</p>
              <p className="text-white">웹사이트: https://devport.kr</p>
            </div>
          </section>

          <div className="border-t border-gray-700 pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              본 약관은 2025년 1월 26일부터 시행됩니다.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/privacy"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            개인정보 처리방침 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
