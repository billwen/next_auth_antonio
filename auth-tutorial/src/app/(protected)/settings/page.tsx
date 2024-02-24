import {auth, signOut} from "@/auth";

const SettingsPage = async () => {

  const session = await auth();

  const role = session?.user?.role;

  return (
    <div>
      {JSON.stringify(session, null, 2)}

      <form action={async () => {
        "use server";

        console.log('signing out');
        await signOut();
      }}>
        <button type="submit">
          Logout
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;

