import './menu.less'

export const createHeaderMenuArchor = ({
  id,
  dataId,
  href,
  text,
  target,
}: {
  id?: string
  dataId?: string
  href: string
  text: string
  target?: string
}) => {
  const $ele = $('<a>')
  if (id) {
    $ele.attr('id', id)
  }
  if (dataId) {
    $ele.attr('data-id', dataId)
  }
  if (href) {
    $ele.attr('href', href)
  }
  if (target) {
    $ele.attr('target', target)
  }
  $ele.text(text)
  $ele.addClass('header-menu-anchor')

  return $ele
}

export const createHeaderMenuBtn = ({ id, text, onClick }: { id?: string; text: string; onClick?: () => void }) => {
  const $ele = $('<span>')
  if (id) {
    $ele.attr('id', id)
  }
  if (onClick) {
    $ele.on('click', onClick)
  }
  $ele.text(text)
  $ele.addClass('header-menu-btn')
  return $ele
}
