export function openApplyAccountModal(userName, corpName, phone) {
  const ev = new CustomEvent('apply_account', {
    detail: {
      userName: userName,
      corpName: corpName,
      phone: phone,
    },
  })
  document.dispatchEvent(ev)
}
