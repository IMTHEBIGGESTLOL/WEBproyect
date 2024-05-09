async function showUserData(section) {
    try {
        const resp = await fetch('/api/users/search/me', { method: 'GET' });
        const data = await resp.json();

        console.log(data);

        if (section === 'general') {
            originalUsername = data.username;
            originalName = data.name;
            originalBio = data.bio;

            document.getElementById('username').textContent = data.username;
            document.getElementById('name').textContent = data.name;
            document.getElementById('bio').textContent = data.bio;

            document.getElementById('editBtnGeneral').addEventListener('click', () => {
                document.getElementById('username').innerHTML = `<input type="text" class="form-control" id="usernameInput" value="${originalUsername}">`;
                document.getElementById('name').innerHTML = `<input type="text" class="form-control" id="nameInput" value="${originalName}">`;
                document.getElementById('bio').innerHTML = `<input type="text" class="form-control" id="bioInput" value="${originalBio}">`;

                document.getElementById('editBtnGeneral').classList.add('d-none');
                document.getElementById('saveBtnGeneral').classList.remove('d-none');
                document.getElementById('cancelBtnGeneral').classList.remove('d-none');
            });

            document.getElementById('saveBtnGeneral').addEventListener('click', async () => {
                const newUsername = document.getElementById('usernameInput').value;
                const newName = document.getElementById('nameInput').value;
                const newBio = document.getElementById('bioInput').value;
                        
                try {
                    const resp = await fetch(`/api/users/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: newUsername,
                            name: newName,
                            bio: newBio
                        })
                    });
            
                    if (resp.ok) {
                        document.getElementById('username').textContent = newUsername;
                        document.getElementById('name').textContent = newName;
                        document.getElementById('bio').textContent = newBio;

                        originalUsername = newUsername;
                        originalName = newName;
                        originalBio = newBio;
            
                        document.getElementById('editBtnGeneral').classList.remove('d-none');
                        document.getElementById('saveBtnGeneral').classList.add('d-none');
                        document.getElementById('cancelBtnGeneral').classList.add('d-none');
                    } else {
                        console.error('Failed to update user data:', resp.statusText);
                    }
                } catch (error) {
                    console.error('Error updating user data:', error);
                }
            });

            document.getElementById('cancelBtnGeneral').addEventListener('click', () => {
                document.getElementById('username').textContent = originalUsername;
                document.getElementById('name').textContent = originalName;
                document.getElementById('bio').textContent = originalBio;

                document.getElementById('editBtnGeneral').classList.remove('d-none');
                document.getElementById('saveBtnGeneral').classList.add('d-none');
                document.getElementById('cancelBtnGeneral').classList.add('d-none');
            });
        } 
        else if (section === 'personal-info') {
            originalCountry = data.country;
            originalPhone = data.phone;

            document.getElementById('email').textContent = data.email;
            document.getElementById('birthday').textContent = new Date(data.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            document.getElementById('country').textContent = data.country;
            document.getElementById('phone').textContent = data.phone;
        
            document.getElementById('editBtnPersonal').addEventListener('click', () => {
                const countryInput = document.getElementById('country');
                const phoneInput = document.getElementById('phone');
        
                countryInput.innerHTML = `<input id="countryInput" type="text" class="form-control" value="${originalCountry}">`;
                phoneInput.innerHTML = `<input id="phoneInput" type="text" class="form-control" value="${originalPhone}">`;
        
                document.getElementById('editBtnPersonal').classList.add('d-none');
                document.getElementById('saveBtnPersonal').classList.remove('d-none');
                document.getElementById('cancelBtnPersonal').classList.remove('d-none');
            });
        
            document.getElementById('saveBtnPersonal').addEventListener('click', async () => {
                const newCountry = document.getElementById('countryInput').value;
                const newPhone = document.getElementById('phoneInput').value;
        
                try {
                    const resp = await fetch(`/api/users/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            country: newCountry,
                            phone: newPhone
                        })
                    });
        
                    if (resp.ok) {
                        document.getElementById('country').textContent = newCountry;
                        document.getElementById('phone').textContent = newPhone;

                        originalCountry = newCountry;
                        originalPhone = newPhone;
        
                        document.getElementById('editBtnPersonal').classList.remove('d-none');
                        document.getElementById('saveBtnPersonal').classList.add('d-none');
                        document.getElementById('cancelBtnPersonal').classList.add('d-none');
                    } else {
                        console.error('Failed to update user data:', resp.statusText);
                    }
                } catch (error) {
                    console.error('Error updating user data:', error);
                }
            });
        
            document.getElementById('cancelBtnPersonal').addEventListener('click', () => {
                document.getElementById('birthday').textContent = originalBirthday
                document.getElementById('country').textContent = originalCountry
                document.getElementById('phone').textContent = originalPhone

                document.getElementById('editBtnPersonal').classList.remove('d-none');
                document.getElementById('saveBtnPersonal').classList.add('d-none');
                document.getElementById('cancelBtnPersonal').classList.add('d-none');
            });
        }
        
    } catch (error) {
        console.error('Error obtaining user data:', error);
    }
}

async function changePassword() {
    const currentPassword = document.getElementById('currentPasswordInput').value;
    const newPassword = document.getElementById('newPasswordInput').value;
    const repeatPassword = document.getElementById('repeatPasswordInput').value;

    if (newPassword !== repeatPassword) {
        console.error('New passwords do not match');
        return;
    }

    try {
        const resp = await fetch(`/api/users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (resp.ok) {
            console.log('Password changed successfully');
            document.getElementById('currentPasswordInput').value = '';
            document.getElementById('newPasswordInput').value = '';
            document.getElementById('repeatPasswordInput').value = '';
        } else {
            console.error('Failed to change password:', resp.statusText);
        }
    } catch (error) {
        console.error('Error changing password:', error);
    }
}

showUserData('general');
showUserData('personal-info');

document.getElementById('saveBtnPassword').addEventListener('click', changePassword);
