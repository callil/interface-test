import { Trans } from '@lingui/macro'
import { formatNumber, formatPrice, NumberType } from '@uniswap/conedison/format'
import { Currency, Price } from '@uniswap/sdk-core'
import { useUSDPrice } from 'hooks/useUSDPrice'
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

interface TradePriceProps {
  price: Price<Currency, Currency>
}

const StyledPriceContainer = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  grid-template-columns: 1fr auto;
  grid-gap: 0.25rem;
  display: flex;
  flex-direction: row;
  text-align: left;
  flex-wrap: wrap;
  user-select: text;
`

export default function TradePrice({ price }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const { baseCurrency, quoteCurrency } = price
  const { data: usdPrice } = useUSDPrice(tryParseCurrencyAmount('1', showInverted ? baseCurrency : quoteCurrency))

  const formattedPrice = useMemo(() => {
    try {
      return formatPrice(showInverted ? price : price.invert(), NumberType.TokenTx)
    } catch {
      return '0'
    }
  }, [price, showInverted])

  const label = showInverted ? `${price.quoteCurrency?.symbol}` : `${price.baseCurrency?.symbol} `
  const labelInverted = showInverted ? `${price.baseCurrency?.symbol} ` : `${price.quoteCurrency?.symbol}`
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted])

  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ?? '-'} ${label}`

  return (
    <StyledPriceContainer
      onClick={(e) => {
        e.stopPropagation() // dont want this click to affect dropdowns / hovers
        flipPrice()
      }}
      title={text}
    >
      <ThemedText.BodySmall>{text}</ThemedText.BodySmall>{' '}
      {usdPrice && (
        <ThemedText.BodySmall color="neutral2">
          <Trans>({formatNumber(usdPrice, NumberType.FiatTokenPrice)})</Trans>
        </ThemedText.BodySmall>
      )}
    </StyledPriceContainer>
  )
}
