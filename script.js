// HTML 문서가 모두 로드되면 아래 코드를 실행하라고 컴퓨터에게 알려줍니다.
document.addEventListener('DOMContentLoaded', () => {

    // HTML에서 우리가 조작할 요소(버튼, 입력창 등)들을 가져와 변수라는 상자에 담아둡니다.
    const contractTypeRadios = document.querySelectorAll('input[name="contract-type"]');
    const clientTypeSelect = document.getElementById('client-type');
    const producerTypeSelect = document.getElementById('producer-type');
    const contractAmountInput = document.getElementById('contract-amount');
    const finalAmountDiv = document.getElementById('final-amount');
    const intermediaryDiv = document.getElementById('intermediary');
    const clientTypeGroup = clientTypeSelect.parentElement; // 고객사 유형 전체를 감싸는 그룹

    // 계산 기능을 하나로 묶어 'calculate'라는 이름을 붙여줍니다.
    function calculate() {
        // 1. 사용자가 선택한 값들을 가져옵니다.
        const contractType = document.querySelector('input[name="contract-type"]:checked').value;
        const clientType = clientTypeSelect.value;
        const producerType = producerTypeSelect.value;
        // 사용자가 입력한 금액을 숫자로 바꿔줍니다. 만약 아무것도 입력 안했으면 0으로 처리합니다.
        const contractAmount = parseFloat(contractAmountInput.value) || 0;

        let finalAmount = ''; // 최종 금액을 담을 빈 상자를 준비합니다.

        // 2. 양자계약일 때와 삼자계약일 때를 나눠서 처리합니다.
        if (contractType === '2party') { // 양자계약 선택 시
            // C. 중개사 메뉴와 B. 고객사 유형 메뉴를 비활성화합니다.
            intermediaryDiv.classList.add('disabled');
            intermediaryDiv.textContent = '해당 없음';
            clientTypeGroup.style.display = 'none'; // 고객사 유형 숨기기

            // 양자계약 계산 로직
            if (producerType === 'corporate') {
                // 법인 제작사: 계약대금 * 0.9
                finalAmount = contractAmount * 0.9;
            } else if (producerType === 'freelancer') {
                // 프리랜서 제작사: 아직 미정
                finalAmount = '추가 예정';
            }

        } else { // 삼자계약 선택 시
            // C. 중개사 메뉴와 B. 고객사 유형 메뉴를 다시 활성화합니다.
            intermediaryDiv.classList.remove('disabled');
            intermediaryDiv.textContent = '드롭샷매치';
            clientTypeGroup.style.display = 'block'; // 고객사 유형 다시 보여주기

            // 삼자계약 계산 로직 (고객사 유형에 따라 또 나뉩니다)
            if (clientType === 'corporate') { // 법인 고객사
                if (producerType === 'corporate') {
                    // -> 법인 제작사: 계약대금 * 0.9
                    finalAmount = contractAmount * 0.9;
                } else if (producerType === 'freelancer') {
                    // -> 프리랜서 제작사: (계약대금 / 1.1) * 0.9 * 0.967
                    const supplyPrice = contractAmount / 1.1; // VAT 제외 금액 계산
                    finalAmount = supplyPrice * 0.9 * 0.967;
                }
            } else if (clientType === 'tax-exempt') { // 면세 고객사
                if (producerType === 'corporate') {
                    // -> 법인 제작사: 계약대금 - (계약대금 * 0.1 * 1.1)
                    finalAmount = contractAmount * 0.89; // 위 식을 간단히 한 결과
                } else {
                    finalAmount = '추가 예정';
                }
            } else { // 간이과세자 등 나머지
                finalAmount = '추가 예정';
            }
        }

        // 3. 계산된 최종 결과를 화면에 보여줍니다.
        if (typeof finalAmount === 'number') {
            // 숫자인 경우, 1000 단위마다 콤마를 찍고 '원'을 붙여서 보여줍니다.
            finalAmountDiv.textContent = `${Math.floor(finalAmount).toLocaleString()} 원`;
        } else {
            // '추가 예정' 같은 텍스트인 경우 그대로 보여줍니다.
            finalAmountDiv.textContent = finalAmount;
        }
    }

    // 사용자가 계약 형태, 고객사/제작사 유형, 금액 중 하나라도 바꾸면 자동으로 'calculate' 함수를 실행하라고 알려줍니다.
    contractTypeRadios.forEach(radio => radio.addEventListener('change', calculate));
    clientTypeSelect.addEventListener('change', calculate);
    producerTypeSelect.addEventListener('change', calculate);
    contractAmountInput.addEventListener('input', calculate);

    // 페이지가 처음 열렸을 때도 한 번 계산해줍니다.
    calculate();
});