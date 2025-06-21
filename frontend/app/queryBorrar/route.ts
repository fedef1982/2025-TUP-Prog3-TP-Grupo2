/*import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listusers() {
  const data = await sql`
    SELECT users.amount, customers.name
    FROM users
    JOIN customers ON users.customer_id = customers.id
    WHERE users.amount = 666;
  `;

  return data;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    return Response.json(await listusers());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}*/
