import * as Dialog from '@radix-ui/react-dialog'
import {
	CloseButton,
	Content,
	Overlay,
	TransactionType,
	TransactionTypeButton
} from './styles'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { TransactionsContext } from '../../contexts/TransactionsContext'

const newTransactionSchema = z.object({
	description: z.string().nonempty(),
	price: z.number().positive(),
	category: z.string().nonempty(),
	type: z.enum(['income', 'outcome'])
})

type NewTransactionInputs = z.infer<typeof newTransactionSchema>

export function NewTransactionModal() {
	const { createTransaction } = useContext(TransactionsContext)

	const {
		control,
		register,
		handleSubmit,
		formState: { isSubmitting },
		reset
	} = useForm<NewTransactionInputs>({
		resolver: zodResolver(newTransactionSchema),
		defaultValues: {
			type: 'income'
		}
	})

	async function handleCreateNewTransaction(data: NewTransactionInputs) {
		const { description, price, category, type } = data
		await createTransaction({ description, price, category, type })

		reset()
	}

	return (
		<Dialog.Portal>
			<Overlay />

			<Content>
				<Dialog.Title>Nova transação</Dialog.Title>

				<CloseButton>
					<X size={24} />
				</CloseButton>

				<form onSubmit={handleSubmit(handleCreateNewTransaction)}>
					<input
						type='text'
						placeholder='Descrição'
						required
						{...register('description')}
					/>
					<input
						type='number'
						placeholder='Valor'
						required
						{...register('price', { valueAsNumber: true })}
					/>
					<input
						type='text'
						placeholder='Categoria'
						required
						{...register('category')}
					/>

					<Controller
						control={control}
						name='type'
						render={({ field }) => (
							<TransactionType
								onValueChange={field.onChange}
								value={field.value}
							>
								<TransactionTypeButton value='income' variant='income'>
									<ArrowCircleUp size={24} />
									Entrada
								</TransactionTypeButton>

								<TransactionTypeButton value='outcome' variant='outcome'>
									<ArrowCircleDown size={24} />
									Saída
								</TransactionTypeButton>
							</TransactionType>
						)}
					/>

					<button type='submit' disabled={isSubmitting}>
						Cadastrar
					</button>
				</form>
			</Content>
		</Dialog.Portal>
	)
}
