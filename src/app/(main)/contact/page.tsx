'use client';
import * as React from 'react';
import { useState } from 'react';
import { Box, Container, Grid, Typography, Paper, Card, CardContent, Link, IconButton, Snackbar, Alert } from '@mui/material';
import Image from 'next/image';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TelegramIcon from '@mui/icons-material/Telegram';

const ContactPage: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  return (
    <Box sx={{ py: 6, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth='lg'>
        {/* Page Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant='h3' fontWeight='bold' gutterBottom>
            Contact Us
          </Typography>
          <Typography variant='subtitle1' color='text.secondary' sx={{ maxWidth: 700, mx: 'auto' }}>
            Have questions ? Were here to assist you ?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Info Section */}
          <Grid item xs={12} md={12}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Logo and Social Links */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                <Box sx={{ width: 200, height: 100, position: 'relative', mb: 2 }}>
                  <Image src='/assets/images/lux-logo.png' alt='LuxCars Logo' fill style={{ objectFit: 'contain' }} />
                </Box>

                <Typography variant='body1' paragraph>
                  Follow us on social media for the latest updates on our luxury car collection.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <IconButton
                    component={Link}
                    href='https://t.me/lkkkk12345'
                    target='_blank'
                    sx={{
                      bgcolor: '#1877F2',
                      color: 'white',
                      '&:hover': { bgcolor: '#0d65d9' },
                    }}>
                    <TelegramIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    href='https://www.facebook.com/profile.php?id=61565751242412'
                    target='_blank'
                    sx={{
                      bgcolor: '#1877F2',
                      color: 'white',
                      '&:hover': { bgcolor: '#0d65d9' },
                    }}>
                    <FacebookIcon />
                  </IconButton>

                  <IconButton
                    component={Link}
                    href='https://www.instagram.com/luxcar_cambodia/'
                    target='_blank'
                    sx={{
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      color: 'white',
                    }}>
                    <InstagramIcon />
                  </IconButton>
                </Box>
              </Paper>

              {/* Contact Information */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.05)',
                }}>
                <Typography variant='h5' fontWeight='bold' gutterBottom>
                  Contact Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PhoneIcon sx={{ color: '#cc0000' }} />
                    <Box>
                      <Typography variant='subtitle2' fontWeight='bold'>
                        Phone
                      </Typography>
                      <Typography variant='body2'>+855 12 964 520</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <EmailIcon sx={{ color: '#cc0000' }} />
                    <Box>
                      <Typography variant='subtitle2' fontWeight='bold'>
                        Email
                      </Typography>
                      <Typography variant='body2'>info@luxcars.com.kh</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocationOnIcon sx={{ color: '#cc0000' }} />
                    <Box>
                      <Typography variant='subtitle2' fontWeight='bold'>
                        Shop Address
                      </Typography>
                      <Typography variant='body2'>Online Shopping Only</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <AccessTimeIcon sx={{ color: '#cc0000' }} />
                    <Box>
                      <Typography variant='subtitle2' fontWeight='bold'>
                        Business Hours
                      </Typography>
                      <Typography variant='body2'>Monday - Sunday: 8:00 AM - 6:00 PM</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant='h4' fontWeight='bold' gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Frequently Asked Questions
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    What payment methods do you accept?
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    ABA and Cash
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    Do you deliver to other provinces?
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Yes, we offer nationwide delivery services for 24 provinces. Delivery charges vary based on location. Please
                    contact our us for more information about delivery to your area.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity='success' sx={{ width: '100%' }}>
          Your message has been sent successfully! Well contact you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
