export const formatCurrency = (amount) => {
     return new Intl.NumberFormat('en-US', {
          // style: 'currency',
          currency: 'ETB',
     }).format(amount)
}