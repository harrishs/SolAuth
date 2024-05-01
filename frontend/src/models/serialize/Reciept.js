import * as borsh from "@project-serum/borsh";

export class Reciept {
	constructor(name, amount, date, collateral) {
		this.name = name;
		this.amount = amount;
		this.date = date;
		this.collateral = collateral;
	}

	borshInstructionSchema = borsh.struct([
		borsh.u8("variant"),
		borsh.str("name"),
		borsh.f32("amount"),
		borsh.str("date"),
		borsh.f32("collateral"),
	]);

	static borshAccountSchema = borsh.struct([
		borsh.u8("initialized"),
		borsh.str("name"),
		borsh.f32("amount"),
		borsh.str("date"),
		borsh.f32("collateral"),
	]);

	serialize() {
		const buffer = Buffer.alloc(2000);
		this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
		return buffer
			.toString()
			.slice(0, this.borshInstructionSchema.getSpan(buffer));
	}

	static deserialize(buffer) {
		if (!buffer) {
			return null;
		}

		try {
			const { name, amount, date, collateral } =
				this.borshAccountSchema.decode(buffer);
			return new Reciept(name, amount, date, collateral);
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}
